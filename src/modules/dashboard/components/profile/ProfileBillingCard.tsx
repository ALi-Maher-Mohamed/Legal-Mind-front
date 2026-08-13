'use client';

import { useState } from 'react';
import { CreditCard, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toastApiError } from '@/lib/api/toast';
import { startCheckout } from '@/modules/payments';
import { CHECKOUT_PLANS } from '@/modules/payments/data/plans';
import type { CheckoutPlanKey } from '@/types/payments.types';
import { formatMoneyCents } from '@/modules/payments/lib/formatMoney';
import { profileCard, profileHeading, profileMuted } from './lib/profileStyles';

export default function ProfileBillingCard() {
  const { t } = useLanguage();
  const [loadingKey, setLoadingKey] = useState<CheckoutPlanKey | null>(null);

  const handleCheckout = async (planKey: CheckoutPlanKey) => {
    if (loadingKey) return;
    setLoadingKey(planKey);
    try {
      await startCheckout(planKey);
    } catch (err) {
      toastApiError(err, t.dashboard.profileBillingCheckoutError);
      setLoadingKey(null);
    }
  };

  const monthly = CHECKOUT_PLANS['pro-monthly'];
  const yearly = CHECKOUT_PLANS['pro-yearly'];

  return (
    <section className={profileCard} dir="rtl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-[rgba(77,126,247,0.12)] dark:text-[#7ba1f9]">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h2 className={profileHeading}>{t.dashboard.profileBilling}</h2>
          <p className={`mt-0.5 ${profileMuted}`}>
            {t.dashboard.profileBillingHint}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-xl border border-brand/15 bg-brand/[0.03] p-4 dark:border-white/10 dark:bg-white/5">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand dark:text-[#7ba1f9]">
            <Sparkles className="h-3.5 w-3.5" />
            {t.dashboard.profileBillingProMonthly}
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {formatMoneyCents(monthly.amount, monthly.currency ?? 'usd')}
            <span className="ms-1 text-xs font-medium text-muted">
              / {t.common.monthly}
            </span>
          </p>
          <button
            type="button"
            disabled={Boolean(loadingKey)}
            onClick={() => void handleCheckout('pro-monthly')}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] px-3 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer dark:bg-brand dark:text-on-brand"
          >
            {loadingKey === 'pro-monthly' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            {loadingKey === 'pro-monthly'
              ? t.dashboard.profileBillingRedirecting
              : t.dashboard.profileBillingUpgrade}
          </button>
        </article>

        <article className="rounded-xl border border-brand/25 bg-brand/[0.06] p-4 ring-1 ring-brand/15 dark:border-white/15 dark:bg-white/[0.07]">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-brand dark:text-[#7ba1f9]">
              {t.dashboard.profileBillingProYearly}
            </span>
            <span className="rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
              {t.common.save20}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {formatMoneyCents(yearly.amount, yearly.currency ?? 'usd')}
            <span className="ms-1 text-xs font-medium text-muted">
              / {t.common.yearly}
            </span>
          </p>
          <button
            type="button"
            disabled={Boolean(loadingKey)}
            onClick={() => void handleCheckout('pro-yearly')}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] px-3 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer dark:bg-brand dark:text-on-brand"
          >
            {loadingKey === 'pro-yearly' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            {loadingKey === 'pro-yearly'
              ? t.dashboard.profileBillingRedirecting
              : t.dashboard.profileBillingUpgrade}
          </button>
        </article>
      </div>
    </section>
  );
}
