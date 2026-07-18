'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui';
import OtpInput from '../../components/OtpInput';
import { useOtpVerify } from '../../hooks/useOtpVerify';

type Props = {
  email: string;
  onVerified: (otp: string) => void;
  onBack: () => void;
};

export default function OtpForm({ email, onVerified, onBack }: Props) {
  const { t } = useLanguage();
  const form = useOtpVerify(email, onVerified);
  const subtitle = t.auth.otpSubtitle.replace('{email}', email || '—');

  return (
    <div className="space-y-6">
      <div className="text-start">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {t.auth.otpTitle}
        </h1>
        <p className="mt-2 text-sm text-muted break-all">{subtitle}</p>
      </div>

      <form onSubmit={form.handleSubmit} className="mt-6 space-y-6">
        <OtpInput value={form.otp} onChange={form.setOtp} disabled={form.isLoading} />

        {form.error && (
          <p className="text-center text-xs text-red-600 dark:text-red-400" role="alert">
            {t.auth.otpInvalid}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          isLoading={form.isLoading}
          disabled={form.otp.length !== 6}
        >
          {t.auth.verifyOtpBtn}
        </Button>
      </form>

      <div className="flex items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={onBack}
          className="font-medium text-muted hover:text-foreground cursor-pointer"
        >
          {t.auth.priorStep}
        </button>
        <button
          type="button"
          onClick={form.resend}
          disabled={form.cooldown > 0}
          className="font-semibold text-brand disabled:text-muted disabled:opacity-60 cursor-pointer"
        >
          {form.cooldown > 0
            ? t.auth.resendIn.replace('{sec}', String(form.cooldown))
            : t.auth.resendCode}
        </button>
      </div>
    </div>
  );
}
