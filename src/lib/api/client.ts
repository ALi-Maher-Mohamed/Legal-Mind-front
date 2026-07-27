import { env } from '@/config/env';
import { ApiError, resolveApiErrorMessage } from './errors';
import { sessionStore } from './session';
import type { ApiResponse } from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  auth?: boolean;
  json?: unknown;
  formData?: FormData;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

async function parseJson(response: Response): Promise<ApiResponse<unknown> | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as ApiResponse<unknown>;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);

  if (options.auth) {
    const token = sessionStore.getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.json !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.json);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body,
    signal: options.signal,
  });

  const payload = await parseJson(response);

  if (!response.ok || payload?.success === false) {
    const errors = payload?.errors ?? null;
    throw new ApiError(
      resolveApiErrorMessage(
        payload?.message,
        errors,
        `فشل الطلب (${response.status})`,
      ),
      response.status,
      errors,
    );
  }

  if (!payload) {
    throw new ApiError('استجابة غير صالحة من الخادم', response.status);
  }

  return payload as ApiResponse<T>;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'json' | 'formData'>) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),

  post: <T>(
    path: string,
    body?: { json?: unknown; formData?: FormData },
    options?: Omit<RequestOptions, 'method' | 'json' | 'formData'>,
  ) =>
    apiRequest<T>(path, {
      ...options,
      method: 'POST',
      json: body?.json,
      formData: body?.formData,
    }),
};
