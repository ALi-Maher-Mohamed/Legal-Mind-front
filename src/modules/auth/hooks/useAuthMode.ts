'use client';

import { useState } from 'react';
import type { AuthMode } from '@/types/auth.types';

export function useAuthMode(initial: AuthMode = 'login') {
  const [mode, setMode] = useState<AuthMode>(initial);

  return {
    mode,
    setMode,
    goLogin: () => setMode('login'),
    goRegister: () => setMode('register'),
    goOnboarding: () => setMode('onboarding'),
  };
}
