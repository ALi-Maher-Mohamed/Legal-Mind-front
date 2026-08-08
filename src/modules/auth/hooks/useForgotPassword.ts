'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { validateForgotPassword } from '../lib/validation';

export function useForgotPassword(onSent: (email: string) => void) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForgotPassword(email);
    if (validationError) {
      toastApiError(new Error(validationError));
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.requestPasswordReset(email.trim());
      toastApiSuccess(result.message);
      onSent(email.trim());
    } catch (error) {
      toastApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, isLoading, handleSubmit };
}
