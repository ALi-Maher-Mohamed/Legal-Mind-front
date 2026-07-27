'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';

export function useForgotPassword(onSent: (email: string) => void) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      const result = await authService.requestPasswordReset(email.trim());
      toastApiSuccess(result.message || 'تم إرسال رابط إعادة التعيين إلى بريدك');
      onSent(email.trim());
    } catch (error) {
      toastApiError(error, 'تعذّر إرسال رابط الاستعادة');
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, isLoading, handleSubmit };
}
