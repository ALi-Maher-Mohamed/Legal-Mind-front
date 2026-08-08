import type { AuthUser } from '@/types/auth.types';
import { getCookie, removeCookie, setCookie } from './cookies';

const USER_KEY = 'legalmind_user';
/** Legacy keys cleared on persist/clear — tokens must not live in JS-readable storage. */
const LEGACY_TOKEN_KEY = 'legalmind_token';
const LEGACY_REFRESH_KEY = 'legalmind_refresh_token';
const LEGACY_REMEMBER_KEY = 'legalmind_remember';

/** Cached public user for UI hydration (not a credential). */
const USER_MAX_AGE = 60 * 60 * 24 * 7;

let accessTokenMemory: string | null = null;

function canUseDom() {
  return typeof window !== 'undefined';
}

function clearLegacyStorage() {
  if (!canUseDom()) return;
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_REFRESH_KEY);
  window.localStorage.removeItem('token');
  window.sessionStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(LEGACY_TOKEN_KEY);
  window.sessionStorage.removeItem(LEGACY_REFRESH_KEY);
  window.sessionStorage.removeItem('token');
  removeCookie(LEGACY_TOKEN_KEY);
  removeCookie(LEGACY_REFRESH_KEY);
  removeCookie(LEGACY_REMEMBER_KEY);
}

export type PersistSessionOptions = {
  /** Presentation-only; backend refresh-cookie lifetime is not controlled by the UI. */
  rememberMe?: boolean;
};

export const sessionStore = {
  getAccessToken(): string | null {
    return accessTokenMemory;
  },

  setAccessToken(token: string | null) {
    accessTokenMemory = token;
  },

  getUser(): AuthUser | null {
    if (!canUseDom()) return null;
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

  persist(user: AuthUser, accessToken: string, _options: PersistSessionOptions = {}) {
    if (!canUseDom()) return;

    clearLegacyStorage();
    accessTokenMemory = accessToken;
    setCookie(USER_KEY, JSON.stringify(user), { maxAgeSeconds: USER_MAX_AGE });
  },

  updateUser(user: AuthUser) {
    if (!canUseDom()) return;
    setCookie(USER_KEY, JSON.stringify(user), { maxAgeSeconds: USER_MAX_AGE });
  },

  clear() {
    accessTokenMemory = null;
    removeCookie(USER_KEY);
    clearLegacyStorage();
  },
};
