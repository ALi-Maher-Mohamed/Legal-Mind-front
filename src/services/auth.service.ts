import { api, refreshSession } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { sessionStore } from "@/lib/api/session";
import { mapApiUserToAuthUser } from "@/modules/auth/lib/mapAuthUser";
import type {
  AuthSessionPayload,
  AuthSessionResponse,
  AuthUser,
  LoginCredentials,
  PublicUser,
  RegisterDraft,
  ResetPasswordPayload,
} from "@/types/auth.types";

type MessageResponse = { message?: string };
type UserResponse = { user: PublicUser; message?: string };
type ResetPasswordResponse = AuthSessionResponse & { message?: string };

function buildRegisterPayload(draft: RegisterDraft) {
  const payload: Record<string, string> = {
    fullName: draft.name.trim(),
    email: draft.email.trim(),
    password: draft.password,
    officeName: draft.firmName.trim(),
    teamSize: draft.teamSize,
  };

  const phone = draft.phone.trim();
  if (phone) payload.phone = phone;

  const barAssociationNumber = draft.barId.trim();
  if (barAssociationNumber) payload.barAssociationNumber = barAssociationNumber;

  return payload;
}

function assertSessionResponse(
  response: AuthSessionResponse | null | undefined,
  context: string,
): asserts response is AuthSessionResponse {
  if (!response?.access_token || !response.user?.id || !response.user?.email) {
    throw new ApiError(`استجابة غير صالحة من الخادم (${context})`, 500);
  }
}

function persistSessionFromAuth(
  response: AuthSessionResponse,
  practiceAreas: string[] = [],
  message?: string,
): AuthSessionPayload {
  assertSessionResponse(response, "auth");
  const user = mapApiUserToAuthUser(response.user, practiceAreas);
  sessionStore.persist(user, response.access_token);
  return {
    user,
    accessToken: response.access_token,
    message,
  };
}

export const authService = {
  /**
   * Login: JSON email/password only.
   * Success body: { access_token, user } + HttpOnly refresh cookie (path /api/v1/auth).
   * Backend gates: email verified + account active.
   */
  async login(credentials: LoginCredentials): Promise<AuthSessionPayload> {
    const response = await api.post<AuthSessionResponse>(
      "/api/v1/auth/login",
      {
        json: {
          email: credentials.email.trim(),
          password: credentials.password,
        },
      },
      { skipAuthRefresh: true },
    );

    return persistSessionFromAuth(response);
  },

  /** Register returns { message, user } only — no tokens. Requires email verify before login. */
  async register(
    draft: RegisterDraft,
  ): Promise<{ user: AuthUser; message?: string }> {
    const response = await api.post<UserResponse>(
      "/api/v1/auth/register",
      { json: buildRegisterPayload(draft) },
      { skipAuthRefresh: true },
    );

    if (!response?.user) {
      throw new ApiError("استجابة غير صالحة من الخادم (register)", 500);
    }

    return {
      user: mapApiUserToAuthUser(response.user, draft.selectedPractices),
      message: response.message || "تم إنشاء الحساب. يرجى تفعيل بريدك الإلكتروني",
    };
  },

  async me(): Promise<AuthUser> {
    const response = await api.get<{ user: PublicUser }>("/api/v1/auth/me", {
      auth: true,
    });
    if (!response?.user) {
      throw new ApiError("استجابة غير صالحة من الخادم (me)", 500);
    }
    const practiceAreas = sessionStore.getUser()?.practiceAreas ?? [];
    const user = mapApiUserToAuthUser(response.user, practiceAreas);
    const token = sessionStore.getAccessToken();
    if (token) {
      sessionStore.persist(user, token);
    } else {
      sessionStore.updateUser(user);
    }
    return user;
  },

  /**
   * Restore in-memory access token from HttpOnly refresh cookie.
   * On app boot: no access token → POST refresh-token → /auth/me.
   */
  async restoreSession(): Promise<{ user: AuthUser; token: string } | null> {
    const existing = sessionStore.getSession();
    if (existing) return existing;

    const refreshed = await refreshSession();
    if (!refreshed) return null;

    try {
      const user = await this.me();
      const token = sessionStore.getAccessToken();
      if (!token) return null;
      return { user, token };
    } catch {
      sessionStore.clear();
      return null;
    }
  },

  async verifyEmail(token: string): Promise<{ message?: string }> {
    const response = await api.post<MessageResponse>(
      "/api/v1/auth/verify-email",
      { json: { token: token.trim() } },
      { skipAuthRefresh: true },
    );
    return { message: response?.message || "تم تأكيد بريدك بنجاح" };
  },

  async resendVerification(email: string): Promise<{ message?: string }> {
    const response = await api.post<MessageResponse>(
      "/api/v1/auth/resend-verification",
      { json: { email: email.trim() } },
      { skipAuthRefresh: true },
    );
    return {
      message: response?.message || "إن وُجد الحساب، سيصلك رابط التفعيل",
    };
  },

  async requestPasswordReset(email: string): Promise<{ message?: string }> {
    const response = await api.post<MessageResponse>(
      "/api/v1/auth/forgot-password",
      { json: { email: email.trim() } },
      { skipAuthRefresh: true },
    );
    return {
      message: response?.message || "إن وُجد الحساب، سيصلك رابط إعادة التعيين",
    };
  },

  /** Reset returns { message, access_token, user } + Set-Cookie refresh. */
  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<AuthSessionPayload> {
    const response = await api.post<ResetPasswordResponse>(
      "/api/v1/auth/reset-password",
      {
        json: {
          token: payload.token.trim(),
          password: payload.password,
        },
      },
      { skipAuthRefresh: true },
    );

    return persistSessionFromAuth(
      response,
      [],
      response?.message || "تم تحديث كلمة المرور بنجاح",
    );
  },

  /** Logout uses refresh cookie (path-scoped to /api/v1/auth). Returns 204. */
  async logout(): Promise<void> {
    try {
      await api.post<void>(
        "/api/v1/auth/logout",
        { json: {} },
        { skipAuthRefresh: true },
      );
    } catch {
      // Local session must clear even if the network call fails.
    } finally {
      sessionStore.clear();
    }
  },

  /** Revokes all sessions. Returns 204. */
  async logoutAll(): Promise<{ message?: string }> {
    try {
      await api.post<void>("/api/v1/auth/logout-all", undefined, {
        auth: true,
      });
    } finally {
      sessionStore.clear();
    }
    return { message: "تم تسجيل الخروج من جميع الأجهزة" };
  },

  persistSession(
    user: AuthUser,
    token: string,
    options?: { rememberMe?: boolean },
  ) {
    sessionStore.persist(user, token, options);
  },

  getSession() {
    return sessionStore.getSession();
  },

  clearSession() {
    sessionStore.clear();
  },
};
