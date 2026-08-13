'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Receipt } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toastApiError } from '@/lib/api/toast';
import { formatMoneyCents, formatPaymentDate } from '@/modules/payments/lib/formatMoney';
import { paymentsService } from '@/services/payments.service';
import type { PaymentDbStatus, PaymentRecord } from '@/types/payments.types';
import { profileCard, profileHeading, profileMuted } from './lib/profileStyles';

const STATUS_FILTERS: Array<PaymentDbStatus | ''> = [
  '',
  'succeeded',
  'pending',
  'failed',
  'canceled',
  'refunded',
];

function statusTone(status: string) {
  switch (status) {
    case 'succeeded':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'pending':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'failed':
      return 'bg-danger/10 text-danger';
    case 'refunded':
      return 'bg-brand/10 text-brand dark:text-[#7ba1f9]';
    default:
      return 'bg-muted/20 text-muted';
  }
}

export default function ProfilePaymentHistoryCard() {
  const { t } = useLanguage();
  const [items, setItems] = useState<PaymentRecord[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<PaymentDbStatus | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const statusLabel = (value: string) => {
    const map = t.dashboard.paymentStatus as Record<string, string>;
    return map[value] || value;
  };

  const load = useCallback(
    async (nextPage: number, append: boolean, filter: PaymentDbStatus | '') => {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      setError('');

      try {
        const result = await paymentsService.getHistory({
          page: nextPage,
          limit: 8,
          status: filter || undefined,
        });
        setItems((prev) =>
          append ? [...prev, ...result.payments] : result.payments,
        );
        setPage(result.pagination.page);
        setHasMore(result.pagination.page < result.pagination.pages);
      } catch (err) {
        if (!append) {
          setItems([]);
          setError(err instanceof Error ? err.message : '');
        }
        toastApiError(err, t.dashboard.profilePaymentsError);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [t.dashboard.profilePaymentsError],
  );

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) void load(1, false, status);
    });
    return () => {
      cancelled = true;
    };
  }, [load, status]);

  return (
    <section className={profileCard} dir="rtl">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-[rgba(77,126,247,0.12)] dark:text-[#7ba1f9]">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h2 className={profileHeading}>{t.dashboard.profilePayments}</h2>
            <p className={`mt-0.5 ${profileMuted}`}>
              {t.dashboard.profilePaymentsHint}
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs text-muted">
          <span>{t.dashboard.profilePaymentsFilter}</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentDbStatus | '')}
            className="rounded-lg border border-brand/15 bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-brand dark:border-white/15 dark:bg-[#0d1528]"
          >
            {STATUS_FILTERS.map((value) => (
              <option key={value || 'all'} value={value}>
                {value
                  ? statusLabel(value)
                  : t.dashboard.profilePaymentsFilterAll}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 animate-pulse rounded-xl bg-brand/5 dark:bg-white/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-6 text-center">
          <p className="text-sm text-danger">{error || t.dashboard.profilePaymentsError}</p>
          <button
            type="button"
            onClick={() => void load(1, false, status)}
            className="mt-3 text-sm font-bold text-brand cursor-pointer dark:text-[#7ba1f9]"
          >
            {t.dashboard.profilePaymentsRetry}
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand/15 px-4 py-10 text-center dark:border-white/10">
          <Receipt className="mx-auto h-8 w-8 text-muted opacity-40" />
          <p className="mt-3 text-sm font-semibold text-foreground">
            {t.dashboard.profilePaymentsEmpty}
          </p>
          <p className={`mt-1 ${profileMuted}`}>
            {t.dashboard.profilePaymentsEmptyHint}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((payment) => (
            <li
              key={payment.id}
              className="flex flex-col gap-2 rounded-xl border border-brand/10 bg-brand/[0.02] px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  {payment.description || payment.planId}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {formatPaymentDate(payment.createdAt)}
                  {payment.planId ? ` · ${payment.planId}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusTone(payment.status)}`}
                >
                  {statusLabel(String(payment.status))}
                </span>
                <span className="text-sm font-extrabold text-foreground">
                  {formatMoneyCents(payment.amount, payment.currency)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {hasMore ? (
        <button
          type="button"
          disabled={isLoadingMore}
          onClick={() => void load(page + 1, true, status)}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-brand/15 py-2.5 text-xs font-bold text-brand transition hover:bg-brand/5 disabled:opacity-50 cursor-pointer dark:border-white/15 dark:text-[#7ba1f9]"
        >
          <ChevronDown className="h-3.5 w-3.5" />
          {isLoadingMore
            ? t.common.loading
            : t.dashboard.profilePaymentsMore}
        </button>
      ) : null}
    </section>
  );
}
