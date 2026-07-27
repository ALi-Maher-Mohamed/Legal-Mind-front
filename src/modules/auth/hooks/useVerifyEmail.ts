'use client';

import { useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';

export type VerifyEmailStatus = 'idle' | 'loading' | 'success' | 'missing' | 'error';

export function useVerifyEmail(token: string | null) {
  const [status, setStatus] = useState<VerifyEmailStatus>(() =>
    token ? 'loading' : 'missing',
  );

  const verify = useCallback(async () => {
    if (!token) {
      setStatus('missing');
      return;
    }
    setStatus('loading');
    try {
      await authService.verifyEmail(token);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [token]);

  useEffect(() => {
    void verify();
  }, [verify]);

  return { status, retry: verify };
}
