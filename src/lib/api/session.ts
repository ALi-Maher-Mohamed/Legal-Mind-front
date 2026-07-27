import type { AuthUser } from '@/types/auth.types';
import { getCookie, removeCookie, setCookie } from './cookies';

const USER_KEY = 'legalmind_user';
const TOKEN_KEY = 'legalmind_token';
const REFRESH_KEY = 'legalmind_refresh_token';
const REMEMBER_KEY = 'legalmind_remember';

/** ~7 days when "remember me" is enabled */
const REMEMBER_MAX_AGE = 60 * 60 * 24 * 7;
/** Access token cookie lifetime when not remembering (browser session-like, 1 day) */
const SESSION_MAX_AGE = 60 * 60 * 24;

function canUseDom() {
  return typeof window !== 'undefined';
}

function clearLegacyStorage() {
  if (!canUseDom()) return;
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_KEY);
}

function cookieOptions(rememberMe: boolean) {
  return rememberMe
    ? { maxAgeSeconds: REMEMBER_MAX_AGE }
    : { maxAgeSeconds: SESSION_MAX_AGE };
}

export type PersistSessionOptions = {
  rememberMe?: boolean;
  refreshToken?: string | null;
};

export const sessionStore = {
  getAccessToken(): string | null {
    return getCookie(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return getCookie(REFRESH_KEY);
  },

  getUser(): AuthUser | null {
    const raw = getCookie(USER_KEY);
    if (!raw) return null;
    try {
      const user = JSON.parse(raw) as AuthUser;
      if (!user?.id || !user?.email) return null;
      return user;
    } catch {
      return null;
    }
  },

  getSession(): { user: AuthUser; token: string } | null {
    const user = this.getUser();
    const token = this.getAccessToken();
    if (!user || !token) return null;
    return { user, token };
  },

  persist(user: AuthUser, accessToken: string, options: PersistSessionOptions = {}) {
    if (!canUseDom()) return;

    const rememberMe =
      options.rememberMe ?? getCookie(REMEMBER_KEY) === '1';
    const opts = cookieOptions(rememberMe);

    clearLegacyStorage();

    setCookie(REMEMBER_KEY, rememberMe ? '1' : '0', opts);
    setCookie(USER_KEY, JSON.stringify(user), opts);
    setCookie(TOKEN_KEY, accessToken, opts);

    if (options.refreshToken) {
      setCookie(REFRESH_KEY, options.refreshToken, opts);
    } else {
      removeCookie(REFRESH_KEY);
    }
  },

  clear() {
    removeCookie(USER_KEY);
    removeCookie(TOKEN_KEY);
    removeCookie(REFRESH_KEY);
    removeCookie(REMEMBER_KEY);
    clearLegacyStorage();
  },
};
