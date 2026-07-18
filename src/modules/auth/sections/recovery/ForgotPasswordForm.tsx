'use client';

import { Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui';
import AuthInput from '../../components/AuthInput';
import { useForgotPassword } from '../../hooks/useForgotPassword';

type Props = {
  onSent: (email: string) => void;
  onBackLogin: () => void;
};

export default function ForgotPasswordForm({ onSent, onBackLogin }: Props) {
  const { t } = useLanguage();
  const form = useForgotPassword(onSent);

  return (
    <div className="space-y-6">
      <div className="text-start">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {t.auth.forgotTitle}
        </h1>
        <p className="mt-2 text-sm text-muted">{t.auth.forgotSubtitle}</p>
      </div>

      <form onSubmit={form.handleSubmit} className="mt-6 space-y-5">
        <AuthInput
          type="email"
          value={form.email}
          onChange={(e) => form.setEmail(e.target.value)}
          placeholder={t.auth.emailPlaceholder}
          required
          icon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />

        {form.error && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {form.error}
          </p>
        )}

        <Button type="submit" variant="primary" fullWidth size="lg" isLoading={form.isLoading}>
          {t.auth.sendCodeBtn}
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
