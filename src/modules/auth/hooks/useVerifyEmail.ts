'use client';

import { useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';

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
      const result = await authService.verifyEmail(token);
      toastApiSuccess(result.message || 'تم تأكيد بريدك بنجاح');
      setStatus('success');
    } catch (error) {
      toastApiError(error, 'تعذّر تأكيد البريد الإلكتروني');
      setStatus('error');
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const run = async () => {
      try {
        const result = await authService.verifyEmail(token);
        if (cancelled) return;
        toastApiSuccess(result.message || 'تم تأكيد بريدك بنجاح');
        setStatus('success');
      } catch (error) {
        if (cancelled) return;
        toastApiError(error, 'تعذّر تأكيد البريد الإلكتروني');
        setStatus('error');
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return { status, retry: verify };
}
