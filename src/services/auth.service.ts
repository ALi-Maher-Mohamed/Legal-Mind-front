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

function persistSessionFromAuth(
  response: AuthSessionResponse,
  practiceAreas: string[] = [],
): AuthSessionPayload {
  const user = mapApiUserToAuthUser(response.user, practiceAreas);
  sessionStore.persist(user, response.access_token);
  return {
    user,
    accessToken: response.access_token,
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSessionPayload> {
    const response = await api.post<AuthSessionResponse>("/api/v1/auth/login", {
      json: {
        email: credentials.email.trim(),
        password: credentials.password,
      },
    });

    const user = mapApiUserToAuthUser(response.user);
    if (!user.isEmailVerified) {
      throw new ApiError("يرجى تفعيل بريدك الإلكتروني قبل تسجيل الدخول", 403);
    }

    sessionStore.persist(user, response.access_token);
    return {
      user,
      accessToken: response.access_token,
    };
  },

  async register(
    draft: RegisterDraft,
  ): Promise<{ user: AuthUser; message?: string }> {
    const response = await api.post<UserResponse>("/api/v1/auth/register", {
      json: buildRegisterPayload(draft),
    });

    return {
      user: mapApiUserToAuthUser(response.user, draft.selectedPractices),
      message: response.message,
    };
  },

  async me(): Promise<AuthUser> {
    const response = await api.get<{ user: PublicUser }>("/api/v1/auth/me", {
      auth: true,
    });
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
   * Restore an in-memory access token from the HTTP-only refresh cookie.
   * Call on protected page load after a full refresh.
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
    const response = await api.post<MessageResponse>("/api/v1/auth/verify-email", {
      json: { token: token.trim() },
    });
    return { message: response?.message };
  },

  async resendVerification(email: string): Promise<{ message?: string }> {
    const response = await api.post<MessageResponse>(
      "/api/v1/auth/resend-verification",
      { json: { email: email.trim() } },
    );
    return { message: response?.message };
  },

  async requestPasswordReset(email: string): Promise<{ message?: string }> {
    const response = await api.post<MessageResponse>(
      "/api/v1/auth/forgot-password",
      { json: { email: email.trim() } },
    );
    return { message: response?.message };
  },

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<AuthSessionPayload> {
    const response = await api.post<AuthSessionResponse>(
      "/api/v1/auth/reset-password",
      {
        json: {
          token: payload.token.trim(),
          password: payload.password,
        },
      },
    );

    return persistSessionFromAuth(response);
  },

  async logout(): Promise<void> {
    try {
      await api.post<void>("/api/v1/auth/logout", undefined, {
        skipAuthRefresh: true,
      });
    } catch {
      // Local session must clear even if the network call fails.
    } finally {
      sessionStore.clear();
    }
  },

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
