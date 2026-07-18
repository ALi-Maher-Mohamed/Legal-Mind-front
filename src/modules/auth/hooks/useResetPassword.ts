'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';

export function useResetPassword(
  email: string,
  otp: string,
  onSuccess: () => void,
) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<'mismatch' | 'weak' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('weak');
      return;
    }
    if (password !== confirm) {
      setError('mismatch');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await authService.resetPassword({ email, otp, password });
      onSuccess();
    } catch {
      setError('weak');
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
