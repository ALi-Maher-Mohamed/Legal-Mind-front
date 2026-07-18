'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui';
import AuthInput from '../../components/AuthInput';
import { useResetPassword } from '../../hooks/useResetPassword';

type Props = {
  email: string;
  otp: string;
  onBackLogin: () => void;
};

export default function ResetPasswordForm({ email, otp, onBackLogin }: Props) {
  const { t } = useLanguage();
  const [done, setDone] = useState(false);
  const form = useResetPassword(email, otp, () => setDone(true));

  if (done) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/15 bg-[#f0f4ff] text-brand dark:border-white/10 dark:bg-brand/15">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t.auth.resetSuccess}</h1>
        <Button type="button" variant="primary" fullWidth size="lg" onClick={onBackLogin}>
          {t.auth.backToLogin}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-start">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {t.auth.resetTitle}
        </h1>
        <p className="mt-2 text-sm text-muted">{t.auth.resetSubtitle}</p>
      </div>

      <form onSubmit={form.handleSubmit} className="mt-6 space-y-5">
        <AuthInput
          type={form.showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => form.setPassword(e.target.value)}
          placeholder={t.auth.newPasswordPlaceholder}
          required
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
          trailing={
            <button
              type="button"
              onClick={() => form.setShowPassword(!form.showPassword)}
              className="rounded-lg p-1.5 text-muted hover:text-foreground cursor-pointer"
              aria-label="Toggle password"
            >
              {form.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <AuthInput
          type={form.showPassword ? 'text' : 'password'}
          value={form.confirm}
          onChange={(e) => form.setConfirm(e.target.value)}
          placeholder={t.auth.confirmPasswordPlaceholder}
          required
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />

        {form.error === 'mismatch' && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {t.auth.passwordMismatch}
          </p>
        )}
        {form.error === 'weak' && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {t.auth.regPasswordPlaceholder}
          </p>
        )}

        <Button type="submit" variant="primary" fullWidth size="lg" isLoading={form.isLoading}>
          {t.auth.resetBtn}
        </Button>
      </form>

      <button
        type="button"
        onClick={onBackLogin}
        className="w-full text-center text-xs font-medium text-brand hover:opacity-80 cursor-pointer"
      >
        {t.auth.backToLogin}
      </button>
    </div>
  );
}
