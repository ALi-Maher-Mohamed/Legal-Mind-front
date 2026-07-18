'use client';

import { useCallback, useState } from 'react';
import type { AuthMode } from '@/types/auth.types';

export function useAuthMode(initial: AuthMode = 'login') {
  const [mode, setMode] = useState<AuthMode>(initial);

  const goLogin = useCallback(() => setMode('login'), []);
  const goRegister = useCallback(() => setMode('register'), []);
  const goOnboarding = useCallback(() => setMode('onboarding'), []);
  const goForgot = useCallback(() => setMode('forgot'), []);
  const goOtp = useCallback(() => setMode('otp'), []);
  const goReset = useCallback(() => setMode('reset'), []);

  return {
    mode,
    setMode,
    goLogin,
    goRegister,
    goOnboarding,
    goForgot,
    goOtp,
    goReset,
  };
}
