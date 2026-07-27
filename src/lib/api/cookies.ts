function canUseDom() {
  return typeof window !== 'undefined';
}

type CookieOptions = {
  maxAgeSeconds?: number;
  /** Session cookie when omitted / undefined maxAge */
  session?: boolean;
};

function isSecureContext() {
  if (!canUseDom()) return false;
  return window.location.protocol === 'https:';
}

export function getCookie(name: string): string | null {
  if (!canUseDom()) return null;
  const encoded = `${encodeURIComponent(name)}=`;
  const parts = document.cookie.split(';');

  for (const part of parts) {
    const cookie = part.trim();
    if (cookie.startsWith(encoded)) {
      return decodeURIComponent(cookie.slice(encoded.length));
    }
  }
  return null;
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (!canUseDom()) return;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; SameSite=Lax`;

  if (!options.session && typeof options.maxAgeSeconds === 'number') {
    cookie += `; Max-Age=${Math.max(0, Math.floor(options.maxAgeSeconds))}`;
  }

  if (isSecureContext()) {
    cookie += '; Secure';
  }

  document.cookie = cookie;
}

export function removeCookie(name: string) {
  if (!canUseDom()) return;
  let cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Lax`;
  if (isSecureContext()) {
    cookie += '; Secure';
  }
  document.cookie = cookie;
}
