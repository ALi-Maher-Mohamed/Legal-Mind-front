'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { ApiError, AuthErrorCode } from '@/lib/api/errors';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { ROUTES } from '@/config/routes';
import type { AuthUser } from '@/types/auth.types';
import { validateLogin } from '../lib/validation';

export function useLoginForm(onSuccess: (user: AuthUser) => void) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateLogin(email, password);
    if (validationError) {
      toastApiError(new Error(validationError));
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login({
        email: email.trim(),
        password,
      });

      toastApiSuccess(result.message || 'تم تسجيل الدخول بنجاح');
      onSuccess(result.user);
    } catch (error) {
      // Unverified email → guide user to resend-verification flow
      if (
        error instanceof ApiError &&
        error.errorCode === AuthErrorCode.EMAIL_NOT_VERIFIED
      ) {
        toastApiError(error);
        router.push(
          `${ROUTES.checkEmail}?email=${encodeURIComponent(email.trim())}`,
        );
        return;
      }

      toastApiError(error, 'تعذّر تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    handleSubmit,
  };
}
