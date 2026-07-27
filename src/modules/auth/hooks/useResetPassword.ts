'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { isPasswordValid, validateResetPassword } from '../lib/validation';

export function useResetPassword(token: string, onSuccess: () => void) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<'mismatch' | 'weak' | 'missing' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('missing');
      return;
    }

    const passwordError = validateResetPassword(token, password);
    if (passwordError) {
      setError(isPasswordValid(password) ? '' : 'weak');
      toastApiError(new Error(passwordError));
      return;
    }

    if (password !== confirm) {
      setError('mismatch');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const result = await authService.resetPassword({ token, password });
      toastApiSuccess(result.message);
      onSuccess();
    } catch (error) {
      toastApiError(error, 'تعذّر تحديث كلمة المرور');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirm,
    setConfirm,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    handleSubmit,
  };
}
