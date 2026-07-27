'use client';

import { useEffect, useState } from 'react';
import { ROUTES } from '@/config/routes';
import { authService } from '@/services/auth.service';

/** Dashboard if cookies have a valid session, otherwise login. */
export function resolveAuthEntryPath() {
  return authService.getSession() ? ROUTES.dashboard : ROUTES.login;
}

export function useAuthEntryPath() {
  const [path, setPath] = useState(ROUTES.login);

  useEffect(() => {
    setPath(resolveAuthEntryPath());
  }, []);

  return path;
}
