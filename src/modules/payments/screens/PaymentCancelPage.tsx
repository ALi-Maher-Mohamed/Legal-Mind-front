'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Ban, Loader2 } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { toastApiError } from '@/lib/api/toast';
import { paymentsCopy as c } from '../data/paymentsCopy';
import {
  readLastCheckoutPlan,
  startCheckout,
} from '../lib/startCheckout';
import type { CheckoutPlanKey } from '@/types/payments.types';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const sessionId =
    searchParams.get('session_id')?.trim() ||
    searchParams.get('sessionId')?.trim() ||
    '';
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    const planKey: CheckoutPlanKey = readLastCheckoutPlan() || 'pro-monthly';

    setIsRetrying(true);
    try {
      await startCheckout(planKey);
    } catch (err) {
      toastApiError(err);
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16 dark:bg-[#070d1d]">
      <div className="w-full max-w-md rounded-2xl border border-brand/15 bg-card p-8 text-center shadow-[0_12px_40px_rgba(0,32,69,0.08)] dark:border-white/10 dark:bg-[rgba(16,26,48,0.9)]">
        <Ban className="mx-auto h-12 w-12 text-muted" />
        <h1 className="mt-5 text-xl font-bold text-foreground">{c.cancelTitle}</h1>
        <p className="mt-2 text-sm text-muted">{c.cancelHint}</p>
        {sessionId ? (
          <p className="mt-3 break-all font-mono text-[10px] text-muted/80">
            {sessionId}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            disabled={isRetrying}
            onClick={() => void handleRetry()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002045] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 cursor-pointer dark:bg-brand dark:text-on-brand"
          >
            {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {c.cancelRetry}
          </button>
          <Link
            href={`${ROUTES.dashboard}?view=profile`}
            className="inline-flex items-center justify-center rounded-xl border border-brand/20 px-4 py-2.5 text-sm font-bold text-brand hover:bg-brand/5 dark:border-white/15 dark:text-[#7ba1f9]"
          >
            {c.cancelHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
