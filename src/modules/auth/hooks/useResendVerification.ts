'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';

export function useResendVerification(email: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  const resend = async () => {
    if (!email || cooldown > 0 || isLoading) return;
    setIsLoading(true);
    try {
      const result = await authService.resendVerification(email);
      toastApiSuccess(result.message || 'تم إعادة إرسال رابط التفعيل');
      setCooldown(30);
    } catch (error) {
      toastApiError(error, 'تعذّر إعادة إرسال رابط التفعيل');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, cooldown, resend };
}
