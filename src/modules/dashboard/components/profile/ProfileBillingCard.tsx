'use client';

import { useState } from 'react';
import { CreditCard, Loader2, Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toastApiError } from '@/lib/api/toast';
import { startCheckout } from '@/modules/payments';
import {
  CHECKOUT_PLANS,
  resolveCheckoutPlanKey,
} from '@/modules/payments/data/plans';
import type { CheckoutPlanKey } from '@/types/payments.types';
import { formatMoneyCents } from '@/modules/payments/lib/formatMoney';
import { profileCard, profileHeading, profileMuted } from './lib/profileStyles';

export default function ProfileBillingCard() {
  const { t } = useLanguage();
  const [yearly, setYearly] = useState(false);
  const [loadingKey, setLoadingKey] = useState<CheckoutPlanKey | null>(null);

  const handleCheckout = async (tier: 'basic' | 'pro') => {
    if (loadingKey) return;
    const planKey = resolveCheckoutPlanKey(tier, yearly);
    setLoadingKey(planKey);
    try {
      await startCheckout(planKey);
    } catch (err) {
      toastApiError(err, t.dashboard.profileBillingCheckoutError);
      setLoadingKey(null);
    }
  };

  const basic = CHECKOUT_PLANS[resolveCheckoutPlanKey('basic', yearly)];
  const pro = CHECKOUT_PLANS[resolveCheckoutPlanKey('pro', yearly)];

  return (
    <section className={profileCard} dir="rtl">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
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

        <div className="inline-flex rounded-xl border border-brand/15 p-1 text-xs font-bold dark:border-white/15">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
              !yearly
                ? 'bg-[#002045] text-white dark:bg-brand dark:text-on-brand'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {t.common.monthly}
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${
              yearly
                ? 'bg-[#002045] text-white dark:bg-brand dark:text-on-brand'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {t.common.yearly}
            <span className="ms-1 text-[10px] opacity-80">{t.common.save20}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-xl border border-brand/15 bg-brand/[0.03] p-4 dark:border-white/10 dark:bg-white/5">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand dark:text-[#7ba1f9]">
            <Zap className="h-3.5 w-3.5" />
            {t.dashboard.profileBillingBasic}
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {formatMoneyCents(
              Math.round(basic.displayPrice * 100),
              basic.currency ?? 'usd',
            )}
            <span className="ms-1 text-xs font-medium text-muted">
              / {t.common.monthly}
            </span>
          </p>
          <ul className="mt-3 space-y-1 text-[11px] text-muted">
            <li>• {t.pricing.features.basic1}</li>
            <li>• {t.pricing.features.basic2}</li>
            <li>• {t.pricing.features.basic3}</li>
          </ul>
          <button
            type="button"
            disabled={Boolean(loadingKey)}
            onClick={() => void handleCheckout('basic')}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand/25 bg-transparent px-3 py-2.5 text-xs font-bold text-brand transition hover:bg-brand/5 disabled:opacity-50 cursor-pointer dark:border-white/20 dark:text-[#7ba1f9]"
          >
            {loadingKey === basic.key ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            {loadingKey === basic.key
              ? t.dashboard.profileBillingRedirecting
              : t.dashboard.profileBillingUpgrade}
          </button>
        </article>

        <article className="rounded-xl border border-brand/25 bg-brand/[0.06] p-4 ring-1 ring-brand/15 dark:border-white/15 dark:bg-white/[0.07]">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand dark:text-[#7ba1f9]">
              <Sparkles className="h-3.5 w-3.5" />
              {t.dashboard.profileBillingPro}
            </span>
            <span className="rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
              {t.common.popular}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {formatMoneyCents(
              Math.round(pro.displayPrice * 100),
              pro.currency ?? 'usd',
            )}
            <span className="ms-1 text-xs font-medium text-muted">
              / {t.common.monthly}
            </span>
          </p>
          <ul className="mt-3 space-y-1 text-[11px] text-muted">
            <li>• {t.pricing.features.pro1}</li>
            <li>• {t.pricing.features.pro2}</li>
            <li>• {t.pricing.features.pro3}</li>
          </ul>
          <button
            type="button"
            disabled={Boolean(loadingKey)}
            onClick={() => void handleCheckout('pro')}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] px-3 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer dark:bg-brand dark:text-on-brand"
          >
            {loadingKey === pro.key ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            {loadingKey === pro.key
              ? t.dashboard.profileBillingRedirecting
              : t.dashboard.profileBillingUpgrade}
          </button>
        </article>
      </div>
    </section>
  );
}
