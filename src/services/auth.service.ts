import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { sessionStore } from "@/lib/api/session";
import { buildRegisterFormData } from "@/modules/auth/lib/buildRegisterFormData";
import { mapApiUserToAuthUser } from "@/modules/auth/lib/mapAuthUser";
import type {
  ApiUser,
  AuthSessionPayload,
  AuthUser,
  LoginCredentials,
  RegisterDraft,
  ResetPasswordPayload,
} from "@/types/auth.types";

type UserEnvelope = { user: ApiUser };
type AuthEnvelope = {
  user: ApiUser;
  accessToken: string;
  refreshToken?: string;
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSessionPayload> {
    const response = await api.post<AuthEnvelope>("/api/auth/login", {
      json: {
        email: credentials.email.trim(),
        password: credentials.password,
      },
    });

    const user = mapApiUserToAuthUser(response.data.user);
    if (!user.isEmailVerified) {
      throw new ApiError("يرجى تفعيل بريدك الإلكتروني قبل تسجيل الدخول", 403);
    }

    sessionStore.persist(user, response.data.accessToken, {
      rememberMe: credentials.rememberMe,
      refreshToken: response.data.refreshToken,
    });

    return {
      user,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      message: response.message,
    };
  },

  async register(
    draft: RegisterDraft,
  ): Promise<{ user: AuthUser; message: string }> {
    const response = await api.post<UserEnvelope>("/api/auth/register", {
      formData: buildRegisterFormData(draft),
    });

    return {
      user: mapApiUserToAuthUser(response.data.user, draft.selectedPractices),
      message: response.message,
    };
  },

  async me(): Promise<AuthUser> {
    const response = await api.get<UserEnvelope>("/api/auth/me", {
      auth: true,
    });
    const practiceAreas = sessionStore.getUser()?.practiceAreas ?? [];
    const user = mapApiUserToAuthUser(response.data.user, practiceAreas);
    const token = sessionStore.getAccessToken();
    if (token) {
      sessionStore.persist(user, token, {
        refreshToken: sessionStore.getRefreshToken(),
      });
    }
    return user;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.post<unknown>("/api/auth/verify-email", {
      json: { token: token.trim() },
    });
    return { message: response.message };
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await api.post<unknown>("/api/auth/resend-verification", {
      json: { email: email.trim() },
    });
    return { message: response.message };
  },

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await api.post<unknown>("/api/auth/forgot-password", {
      json: { email: email.trim() },
    });
    return { message: response.message };
  },

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<AuthSessionPayload> {
    const response = await api.post<AuthEnvelope>("/api/auth/reset-password", {
      json: {
        token: payload.token.trim(),
        password: payload.password,
      },
    });

    const user = mapApiUserToAuthUser(response.data.user);
    sessionStore.persist(user, response.data.accessToken, {
      rememberMe: true,
      refreshToken: response.data.refreshToken,
    });

    return {
      user,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      message: response.message,
    };
  },

  async logout(): Promise<void> {
    const refreshToken = sessionStore.getRefreshToken();
    try {
      if (refreshToken) {
        await api.post("/api/auth/logout", { json: { refreshToken } });
      } else if (sessionStore.getAccessToken()) {
        await api.post("/api/auth/logout-all", undefined, { auth: true });
      }
    } catch {
      // Local session must clear even if the network call fails.
    } finally {
      sessionStore.clear();
    }
  },

  persistSession(
    user: AuthUser,
    token: string,
    options?: { rememberMe?: boolean; refreshToken?: string | null },
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
