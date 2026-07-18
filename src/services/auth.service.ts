import type { AuthUser, LoginCredentials, RegisterDraft } from '@/types/auth.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; token: string; email: string }> {
    await delay(600);
    if (!credentials.email || !credentials.password) {
      throw new Error('Missing credentials');
    }
    return {
      success: true,
      token: `mock-jwt-${Math.random().toString(36).substring(7)}`,
      email: credentials.email,
    };
  },

  async register(draft: RegisterDraft): Promise<{ success: boolean }> {
    await delay(600);
    if (!draft.name || !draft.email || !draft.password) {
      throw new Error('Incomplete registration');
    }
    return { success: true };
  },

  persistSession(user: AuthUser, token: string) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('legalmind_user', JSON.stringify(user));
    sessionStorage.setItem('legalmind_token', token);
  },

  getSession(): { user: AuthUser; token: string } | null {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem('legalmind_user');
    const token = sessionStorage.getItem('legalmind_token');
    if (!raw || !token) return null;
    try {
      const user = JSON.parse(raw) as AuthUser;
      if (!user?.id || !user?.email) return null;
      return { user, token };
    } catch {
      return null;
    }
  },

  clearSession() {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('legalmind_user');
    sessionStorage.removeItem('legalmind_token');
  },
};
