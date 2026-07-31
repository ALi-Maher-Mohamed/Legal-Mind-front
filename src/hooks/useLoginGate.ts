'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/lib/api/session';
import { ROUTES } from '@/config/routes';

export function useLoginGate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isAuthenticated = useCallback(() => {
    return Boolean(sessionStore.getAccessToken() && sessionStore.getUser());
  }, []);

  const requireAuth = useCallback(
    (action?: () => void) => {
      if (isAuthenticated()) {
        action?.();
        return true;
      }
      setOpen(true);
      return false;
    },
    [isAuthenticated],
  );

  const close = useCallback(() => setOpen(false), []);

  const confirmLogin = useCallback(() => {
    setOpen(false);
    router.push(ROUTES.login);
  }, [router]);

  return {
    loginOpen: open,
    requireAuth,
    closeLoginGate: close,
    confirmLogin,
    isAuthenticated,
  };
}
