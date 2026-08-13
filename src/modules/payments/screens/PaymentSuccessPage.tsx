'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { toastApiError } from '@/lib/api/toast';
import { authService } from '@/services/auth.service';
import { paymentsService } from '@/services/payments.service';
import type { CheckoutStatus } from '@/types/payments.types';
import { paymentsCopy as c } from '../data/paymentsCopy';
import { formatMoneyCents } from '../lib/formatMoney';

const POLL_MS = 2500;
const MAX_POLLS = 24;

type Phase = 'auth' | 'polling' | 'paid' | 'unpaid' | 'error';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId =
    searchParams.get('session_id')?.trim() ||
    searchParams.get('sessionId')?.trim() ||
    '';

  const [phase, setPhase] = useState<Phase>('auth');
  const [status, setStatus] = useState<CheckoutStatus | null>(null);
  const [error, setError] = useState('');
  const polls = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const finishUnpaid = (result: CheckoutStatus) => {
      setStatus(result);
      setPhase(result.paymentStatus === 'paid' ? 'paid' : 'unpaid');
    };

    const poll = async () => {
      if (!sessionId) {
        setError(c.missingSession);
        setPhase('error');
        return;
      }

      try {
        const session = await authService.restoreSession();
        if (cancelled) return;
        if (!session) {
          setError(c.authRequired);
          setPhase('error');
          return;
        }

        setPhase('polling');
        const result = await paymentsService.getCheckoutStatus(sessionId);
        if (cancelled) return;
        setStatus(result);

        const paid =
          result.paymentStatus === 'paid' ||
          result.status === 'paid' ||
          result.dbStatus === 'succeeded';

        if (paid) {
          setPhase('paid');
          return;
        }

        polls.current += 1;
        if (polls.current >= MAX_POLLS) {
          finishUnpaid(result);
          return;
        }

        timer = setTimeout(() => {
          void poll();
        }, POLL_MS);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : c.statusError;
        setError(message);
        setPhase('error');
        toastApiError(err, c.statusError);
      }
    };

    void poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [sessionId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16 dark:bg-[#070d1d]">
      <div className="w-full max-w-md rounded-2xl border border-brand/15 bg-card p-8 text-center shadow-[0_12px_40px_rgba(0,32,69,0.08)] dark:border-white/10 dark:bg-[rgba(16,26,48,0.9)]">
        {phase === 'auth' || phase === 'polling' ? (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand" />
            <h1 className="mt-5 text-xl font-bold text-foreground">
              {c.successPendingTitle}
            </h1>
            <p className="mt-2 text-sm text-muted">{c.successPendingHint}</p>
          </>
        ) : null}

        {phase === 'paid' ? (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h1 className="mt-5 text-xl font-bold text-foreground">
              {c.successTitle}
            </h1>
            <p className="mt-2 text-sm text-muted">{c.successHint}</p>
            {status ? (
              <dl className="mt-5 space-y-2 rounded-xl border border-brand/10 bg-brand/[0.03] px-4 py-3 text-start text-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{c.amountLabel}</dt>
                  <dd className="font-semibold text-foreground">
                    {formatMoneyCents(status.amount, status.currency)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">{c.statusLabel}</dt>
                  <dd className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {status.dbStatus || status.paymentStatus}
                  </dd>
                </div>
              </dl>
            ) : null}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                href={`${ROUTES.dashboard}?view=profile`}
                className="inline-flex items-center justify-center rounded-xl bg-[#002045] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 dark:bg-brand dark:text-on-brand"
              >
                {c.successCta}
              </Link>
              <Link
                href={ROUTES.dashboard}
                className="inline-flex items-center justify-center rounded-xl border border-brand/20 px-4 py-2.5 text-sm font-bold text-brand hover:bg-brand/5 dark:border-white/15 dark:text-[#7ba1f9]"
              >
                {c.successDashboard}
              </Link>
            </div>
          </>
        ) : null}

        {phase === 'unpaid' ? (
          <>
            <Loader2 className="mx-auto h-12 w-12 text-amber-500" />
            <h1 className="mt-5 text-xl font-bold text-foreground">
              {c.successPendingTitle}
            </h1>
            <p className="mt-2 text-sm text-muted">{c.successPendingHint}</p>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#002045] px-4 py-2.5 text-sm font-bold text-white cursor-pointer dark:bg-brand dark:text-on-brand"
            >
              {c.statusRetry}
            </button>
          </>
        ) : null}

        {phase === 'error' ? (
          <>
            <XCircle className="mx-auto h-12 w-12 text-danger" />
            <h1 className="mt-5 text-xl font-bold text-foreground">
              {c.statusError}
            </h1>
            <p className="mt-2 text-sm text-muted">{error}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              {error === c.authRequired ? (
                <Link
                  href={ROUTES.login}
                  className="inline-flex items-center justify-center rounded-xl bg-[#002045] px-4 py-2.5 text-sm font-bold text-white dark:bg-brand dark:text-on-brand"
                >
                  {c.goLogin}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => router.refresh()}
                  className="inline-flex items-center justify-center rounded-xl bg-[#002045] px-4 py-2.5 text-sm font-bold text-white cursor-pointer dark:bg-brand dark:text-on-brand"
                >
                  {c.statusRetry}
                </button>
              )}
              <Link
                href={ROUTES.dashboard}
                className="inline-flex items-center justify-center rounded-xl border border-brand/20 px-4 py-2.5 text-sm font-bold text-brand dark:border-white/15 dark:text-[#7ba1f9]"
              >
                {c.successDashboard}
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
