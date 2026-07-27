'use client';

import { CheckCircle2, Loader2, MailWarning, ShieldX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import { Button } from '@/components/ui';
import type { VerifyEmailStatus as Status } from '../../hooks/useVerifyEmail';

type Props = {
  status: Status;
  onRetry: () => void;
};

export default function VerifyEmailStatus({ status, onRetry }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const goLogin = () => router.push(ROUTES.login);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/15 bg-[#f0f4ff] text-brand dark:border-white/10 dark:bg-brand/15">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t.auth.verifyEmailTitle}</h1>
        <p className="text-sm text-muted">{t.auth.verifyEmailChecking}</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/15 bg-[#f0f4ff] text-brand dark:border-white/10 dark:bg-brand/15">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {t.auth.verifyEmailSuccessTitle}
          </h1>
          <p className="mt-2 text-sm text-muted">{t.auth.verifyEmailSuccessDesc}</p>
        </div>
        <Button type="button" variant="primary" fullWidth size="lg" onClick={goLogin}>
          {t.auth.backToLogin}
        </Button>
      </div>
    );
  }

  const isMissing = status === 'missing';
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/15 bg-[#f0f4ff] text-brand dark:border-white/10 dark:bg-brand/15">
        {isMissing ? <MailWarning className="h-8 w-8" /> : <ShieldX className="h-8 w-8" />}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {isMissing ? t.auth.verifyEmailMissingTitle : t.auth.verifyEmailErrorTitle}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {isMissing ? t.auth.verifyEmailMissingDesc : t.auth.verifyEmailErrorDesc}
        </p>
      </div>
      <div className="space-y-3">
        {!isMissing && (
          <Button type="button" variant="primary" fullWidth size="lg" onClick={onRetry}>
            {t.auth.verifyEmailRetry}
          </Button>
        )}
        <button
          type="button"
          onClick={goLogin}
          className="w-full text-center text-xs font-medium text-brand hover:opacity-80 cursor-pointer"
        >
          {t.auth.backToLogin}
        </button>
      </div>
    </div>
  );
}
