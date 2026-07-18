'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';

export function useForgotPassword(onSent: (email: string) => void) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError('');
    try {
      await authService.requestPasswordReset(email.trim());
      onSent(email.trim());
    } catch {
      setError('Invalid email');
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, isLoading, error, handleSubmit };
}
