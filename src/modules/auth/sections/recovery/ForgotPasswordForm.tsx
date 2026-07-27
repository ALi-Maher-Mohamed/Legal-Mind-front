'use client';

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui';
import AuthInput from '../../components/AuthInput';
import { useForgotPassword } from '../../hooks/useForgotPassword';

type Props = {
  onBackLogin: () => void;
};

export default function ForgotPasswordForm({ onBackLogin }: Props) {
  const { t } = useLanguage();
  const [sentEmail, setSentEmail] = useState('');
  const form = useForgotPassword((email) => setSentEmail(email));

  if (sentEmail) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/15 bg-[#f0f4ff] text-brand dark:border-white/10 dark:bg-brand/15">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t.auth.forgotSentTitle}</h1>
          <p className="mt-2 text-sm text-muted">
            {t.auth.forgotSentSubtitle.replace('{email}', sentEmail)}
          </p>
        </div>
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

        <Button type="submit" variant="primary" fullWidth size="lg" isLoading={form.isLoading}>
          {t.auth.sendResetLinkBtn}
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
