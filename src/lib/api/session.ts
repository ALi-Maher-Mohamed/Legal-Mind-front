import type { AuthUser } from '@/types/auth.types';

const USER_KEY = 'legalmind_user';
const TOKEN_KEY = 'legalmind_token';
const REFRESH_KEY = 'legalmind_refresh_token';

type BrowserStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function canUseDom() {
  return typeof window !== 'undefined';
}

function readFrom(storages: BrowserStorage[], key: string): string | null {
  for (const storage of storages) {
    const value = storage.getItem(key);
    if (value) return value;
  }
  return null;
}

function writeTo(storage: BrowserStorage, key: string, value: string) {
  storage.setItem(key, value);
}

function removeFromAll(key: string) {
  if (!canUseDom()) return;
  window.localStorage.removeItem(key);
  window.sessionStorage.removeItem(key);
}

export type PersistSessionOptions = {
  rememberMe?: boolean;
  refreshToken?: string | null;
};

export const sessionStore = {
  getAccessToken(): string | null {
    if (!canUseDom()) return null;
    return readFrom([window.localStorage, window.sessionStorage], TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!canUseDom()) return null;
    return readFrom([window.localStorage, window.sessionStorage], REFRESH_KEY);
  },

  getUser(): AuthUser | null {
    if (!canUseDom()) return null;
    const raw = readFrom([window.localStorage, window.sessionStorage], USER_KEY);
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

    const rememberMe = options.rememberMe ?? Boolean(window.localStorage.getItem(TOKEN_KEY));
    const primary = rememberMe ? window.localStorage : window.sessionStorage;
    const secondary = rememberMe ? window.sessionStorage : window.localStorage;

    secondary.removeItem(USER_KEY);
    secondary.removeItem(TOKEN_KEY);
    secondary.removeItem(REFRESH_KEY);

    writeTo(primary, USER_KEY, JSON.stringify(user));
    writeTo(primary, TOKEN_KEY, accessToken);

    if (options.refreshToken) {
      writeTo(primary, REFRESH_KEY, options.refreshToken);
    } else {
      primary.removeItem(REFRESH_KEY);
    }
  },

  clear() {
    removeFromAll(USER_KEY);
    removeFromAll(TOKEN_KEY);
    removeFromAll(REFRESH_KEY);
  },
};
