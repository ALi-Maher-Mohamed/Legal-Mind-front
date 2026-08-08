import { env } from "@/config/env";
import { mapApiUserToAuthUser } from "@/modules/auth/lib/mapAuthUser";
import type { PublicUser } from "@/types/auth.types";
import {
  ApiError,
  REFRESHABLE_AUTH_CODES,
  resolveApiErrorMessage,
} from "./errors";
import { sessionStore } from "./session";
import type { ApiFailure } from "./types";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  auth?: boolean;
  json?: unknown;
  formData?: FormData;
  headers?: HeadersInit;
  signal?: AbortSignal;
  /** Skip the single-flight refresh + retry (used by refresh itself). */
  skipAuthRefresh?: boolean;
};

type ParsedBody = {
  payload: unknown;
  failure: ApiFailure | null;
};

/** Auth routes that must not trigger token refresh retry. */
const NO_REFRESH_PATHS = new Set([
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh-token",
  "/api/v1/auth/logout",
  "/api/v1/auth/verify-email",
  "/api/v1/auth/resend-verification",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password",
]);

let refreshPromise: Promise<boolean> | null = null;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function toApiFailure(
  payload: unknown,
  responseOk: boolean,
): ApiFailure | null {
  const record = asRecord(payload);
  if (!record) return null;

  const message = typeof record.message === "string" ? record.message : "";
  const error = typeof record.error === "string" ? record.error : "";
  const requestId =
    typeof record.request_id === "string"
      ? record.request_id
      : typeof record.requestId === "string"
        ? record.requestId
        : "";

  // Standard envelope: { success: false, error, message, details?, request_id }
  if (record.success === false) {
    return {
      success: false,
      error: error || "ERROR",
      message,
      details: (record.details as ApiFailure["details"]) ?? undefined,
      request_id: requestId,
    };
  }

  // Rate-limit / alternate failures: { error, message } without success:false
  if (!responseOk && (error || message || record.details)) {
    return {
      success: false,
      error: error || "ERROR",
      message,
      details: (record.details as ApiFailure["details"]) ?? undefined,
      request_id: requestId,
    };
  }

  return null;
}

async function parseBody(response: Response): Promise<ParsedBody> {
  if (response.status === 204) {
    return { payload: undefined, failure: null };
  }

  const text = await response.text();
  if (!text) {
    return { payload: undefined, failure: null };
  }

  try {
    const payload: unknown = JSON.parse(text);
    return {
      payload,
      failure: toApiFailure(payload, response.ok),
    };
  } catch {
    return { payload: null, failure: null };
  }
}

function throwApiFailure(status: number, failure: ApiFailure | null): never {
  const details = failure?.details ?? null;
  // Display text is always from backend `message` (or backend field details).
  const message = resolveApiErrorMessage(failure?.message, details);

  if (failure?.request_id) {
    console.error("[api]", failure.error || "request_failed", {
      request_id: failure.request_id,
      status,
      message: failure.message,
    });
  }

  throw new ApiError(message, status, details, {
    errorCode: failure?.error ?? null,
    requestId: failure?.request_id ?? null,
  });
}

function shouldAttemptRefresh(
  path: string,
  status: number,
  failure: ApiFailure | null,
  options: RequestOptions,
  allowRetry: boolean,
): boolean {
  if (!allowRetry || options.skipAuthRefresh) return false;
  if (status !== 401) return false;
  if (NO_REFRESH_PATHS.has(path)) return false;

  // Prefer documented auth codes; if body is empty, still try once (expired access).
  if (!failure?.error) return true;
  return REFRESHABLE_AUTH_CODES.has(failure.error);
}

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(
        `${env.apiBaseUrl}/api/v1/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // Empty body: refresh cookie is on path /api/v1/auth only
          body: JSON.stringify({}),
        },
      );

      if (!response.ok) {
        sessionStore.clear();
        return false;
      }

      const { payload, failure } = await parseBody(response);
      if (failure || !payload || typeof payload !== "object") {
        sessionStore.clear();
        return false;
      }

      const data = payload as { access_token?: string; user?: PublicUser };
      const token =
        typeof data.access_token === "string" ? data.access_token : null;
      if (!token) {
        sessionStore.clear();
        return false;
      }

      if (data.user && typeof data.user === "object" && data.user.id) {
        const practiceAreas = sessionStore.getUser()?.practiceAreas ?? [];
        sessionStore.persist(
          mapApiUserToAuthUser(data.user, practiceAreas),
          token,
        );
      } else {
        const existingUser = sessionStore.getUser();
        if (existingUser) {
          sessionStore.persist(existingUser, token);
        } else {
          sessionStore.setAccessToken(token);
        }
      }
      return true;
    } catch {
      sessionStore.clear();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function executeRequest<T>(
  path: string,
  options: RequestOptions,
  allowRetry: boolean,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.auth) {
    const token = sessionStore.getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.json);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    body,
    signal: options.signal,
    credentials: "include",
  });

  const { payload, failure } = await parseBody(response);

  if (
    shouldAttemptRefresh(path, response.status, failure, options, allowRetry)
  ) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return executeRequest<T>(path, options, false);
    }
    sessionStore.clear();
  }

  if (!response.ok || failure) {
    throwApiFailure(response.status, failure);
  }

  // 204 No Content and other empty successful bodies.
  if (payload === undefined) {
    return undefined as T;
  }

  if (payload === null) {
    throw new ApiError("استجابة غير صالحة من الخادم", response.status);
  }

  return payload as T;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  return executeRequest<T>(path, options, true);
}

export async function apiDownload(
  path: string,
  options: Omit<RequestOptions, "method" | "json" | "formData"> = {},
): Promise<{ blob: Blob; fileName: string | null }> {
  const headers = new Headers(options.headers);

  if (options.auth) {
    const token = sessionStore.getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: "GET",
    headers,
    signal: options.signal,
    credentials: "include",
  });

  if (response.status === 401 && !options.skipAuthRefresh) {
    const { failure } = await parseBody(response.clone());
    if (shouldAttemptRefresh(path, 401, failure, options, true)) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return apiDownload(path, { ...options, skipAuthRefresh: true });
      }
      sessionStore.clear();
    }
  }

  if (!response.ok) {
    const { failure } = await parseBody(response);
    throwApiFailure(response.status, failure);
  }

  const disposition = response.headers.get("Content-Disposition");
  const utfMatch = disposition?.match(/filename\*=UTF-8''([^;]+)/i);
  const plainMatch = disposition?.match(/filename="?([^";]+)"?/i);
  const headerName = utfMatch?.[1]
    ? decodeURIComponent(utfMatch[1])
    : plainMatch?.[1]?.trim() || null;

  const contentType = response.headers.get("Content-Type") || undefined;
  const rawBlob = await response.blob();
  const blob =
    contentType && rawBlob.type !== contentType
      ? new Blob([rawBlob], { type: contentType.split(";")[0]?.trim() })
      : rawBlob;

  return { blob, fileName: headerName };
}

/** Shared single-flight refresh used by session restore. */
export async function refreshSession(): Promise<boolean> {
  return refreshAccessToken();
}

export const api = {
  get: <T>(
    path: string,
    options?: Omit<RequestOptions, "method" | "json" | "formData">,
  ) => apiRequest<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body?: { json?: unknown; formData?: FormData },
    options?: Omit<RequestOptions, "method" | "json" | "formData">,
  ) =>
    apiRequest<T>(path, {
      ...options,
      method: "POST",
      json: body?.json,
      formData: body?.formData,
    }),

  put: <T>(
    path: string,
    body?: { json?: unknown; formData?: FormData },
    options?: Omit<RequestOptions, "method" | "json" | "formData">,
  ) =>
    apiRequest<T>(path, {
      ...options,
      method: "PUT",
      json: body?.json,
      formData: body?.formData,
    }),

  patch: <T>(
    path: string,
    body?: { json?: unknown; formData?: FormData },
    options?: Omit<RequestOptions, "method" | "json" | "formData">,
  ) =>
    apiRequest<T>(path, {
      ...options,
      method: "PATCH",
      json: body?.json,
      formData: body?.formData,
    }),

  delete: <T = void>(
    path: string,
    options?: Omit<RequestOptions, "method" | "json" | "formData">,
  ) => apiRequest<T>(path, { ...options, method: "DELETE" }),

  download: apiDownload,
};
