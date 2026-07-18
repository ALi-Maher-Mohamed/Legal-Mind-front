import type { AuthUser, LoginCredentials, RegisterDraft, ResetPasswordPayload } from '@/types/auth.types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const RECOVERY_EMAIL_KEY = 'legalmind_recovery_email';
const RECOVERY_OTP_KEY = 'legalmind_recovery_otp';

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

  async requestPasswordReset(email: string): Promise<{ success: boolean; otp: string }> {
    await delay(700);
    if (!email.includes('@')) throw new Error('Invalid email');
    const otp = '123456';
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(RECOVERY_EMAIL_KEY, email);
      sessionStorage.setItem(RECOVERY_OTP_KEY, otp);
    }
    return { success: true, otp };
  },

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean }> {
    await delay(500);
    const stored =
      typeof window !== 'undefined' ? sessionStorage.getItem(RECOVERY_OTP_KEY) : null;
    const expected = stored || '123456';
    if (!email || otp.length !== 6 || otp !== expected) {
      throw new Error('Invalid code');
    }
    return { success: true };
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean }> {
    await delay(700);
    if (!payload.password || payload.password.length < 6) {
      throw new Error('Weak password');
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(RECOVERY_EMAIL_KEY);
      sessionStorage.removeItem(RECOVERY_OTP_KEY);
    }
    return { success: true };
  },

  getRecoveryEmail(): string {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem(RECOVERY_EMAIL_KEY) || '';
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
