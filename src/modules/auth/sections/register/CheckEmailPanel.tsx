'use client';

import { MailOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import { Button } from '@/components/ui';
import { useResendVerification } from '../../hooks/useResendVerification';

type Props = {
  email: string;
};

export default function CheckEmailPanel({ email }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const { isLoading, cooldown, resend } = useResendVerification(email);

  const subtitle = t.auth.checkEmailSubtitle.replace('{email}', email || '—');
  const resendLabel =
    cooldown > 0
      ? t.auth.resendIn.replace('{sec}', String(cooldown))
      : t.auth.resendVerificationBtn;

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/15 bg-[#f0f4ff] text-brand dark:border-white/10 dark:bg-brand/15">
        <MailOpen className="h-8 w-8" />
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t.auth.checkEmailTitle}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{subtitle}</p>
        <p className="mt-3 text-sm text-foreground/80">{t.auth.checkEmailHint}</p>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => router.push(ROUTES.login)}
        >
          {t.auth.backToLogin}
        </Button>

        <button
          type="button"
          onClick={() => void resend()}
          disabled={!email || isLoading || cooldown > 0}
          className="w-full text-center text-xs font-medium text-brand transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? t.common.loading : resendLabel}
        </button>
      </div>
    </div>
  );
}
