'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';

export function useOtpVerify(email: string, onVerified: (otp: string) => void) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsLoading(true);
    setError('');
    try {
      await authService.verifyOtp(email, otp);
      onVerified(otp);
    } catch {
      setError('invalid');
    } finally {
      setIsLoading(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || !email) return;
    setError('');
    await authService.requestPasswordReset(email);
    setCooldown(30);
    setOtp('');
  };

  return { otp, setOtp, isLoading, error, cooldown, handleSubmit, resend };
}
