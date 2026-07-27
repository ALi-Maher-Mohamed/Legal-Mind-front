'use client';

import { useCallback, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';

export type VerifyEmailStatus = 'idle' | 'loading' | 'success' | 'missing' | 'error';

type VerifyResult = { message: string };

/** Survives React Strict Mode remounts so the same token is verified once. */
const verifyCache = new Map<string, Promise<VerifyResult>>();
const succeededTokens = new Set<string>();
const toastedTokens = new Set<string>();

function verifyOnce(token: string): Promise<VerifyResult> {
  const cached = verifyCache.get(token);
  if (cached) return cached;

  const request = authService
    .verifyEmail(token)
    .then((result) => {
      succeededTokens.add(token);
      return result;
    })
    .catch((error) => {
      if (!succeededTokens.has(token)) {
        verifyCache.delete(token);
      }
      throw error;
    });

  verifyCache.set(token, request);
  return request;
}

export function useVerifyEmail(token: string | null) {
  const [status, setStatus] = useState<VerifyEmailStatus>(() => {
    if (!token) return 'missing';
    if (succeededTokens.has(token)) return 'success';
    return 'loading';
  });

  const runVerify = useCallback(async () => {
    if (!token) {
      setStatus('missing');
      return;
    }

    if (succeededTokens.has(token)) {
      setStatus('success');
      return;
    }

    setStatus('loading');
    try {
      const result = await verifyOnce(token);
      if (!toastedTokens.has(token)) {
        toastedTokens.add(token);
        toastApiSuccess(result.message || 'تم تأكيد بريدك بنجاح');
      }
      setStatus('success');
    } catch (error) {
      if (succeededTokens.has(token)) {
        setStatus('success');
        return;
      }
      toastApiError(error, 'تعذّر تأكيد البريد الإلكتروني');
      setStatus('error');
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    let active = true;

    const run = async () => {
      if (succeededTokens.has(token)) {
        if (active) setStatus('success');
        return;
      }

      try {
        const result = await verifyOnce(token);
        if (!active) return;
        if (!toastedTokens.has(token)) {
          toastedTokens.add(token);
          toastApiSuccess(result.message || 'تم تأكيد بريدك بنجاح');
        }
        setStatus('success');
      } catch (error) {
        if (!active) return;
        if (succeededTokens.has(token)) {
          setStatus('success');
          return;
        }
        toastApiError(error, 'تعذّر تأكيد البريد الإلكتروني');
        setStatus('error');
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [token]);

  return { status, retry: runVerify };
}
