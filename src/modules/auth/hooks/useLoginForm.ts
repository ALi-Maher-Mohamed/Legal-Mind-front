'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import type { AuthUser } from '@/types/auth.types';
import { validateLogin } from '../lib/validation';

export function useLoginForm(onSuccess: (user: AuthUser) => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
      const result = await authService.login({ email, password, rememberMe });
      toastApiSuccess(result.message);
      onSuccess(result.user);
    } catch (error) {
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
    rememberMe,
    setRememberMe,
    isLoading,
    handleSubmit,
  };
}
