'use client';

import { useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useDeskActivity } from '../../hooks/useDeskActivity';
import DashPanel from '../ui/DashPanel';
import ActivityItem from './ActivityItem';

function formatPeriodDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ActivityFeed() {
  const { t } = useLanguage();
  const {
    daily,
    period,
    pagination,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  } = useDeskActivity();
  const [selected, setSelected] = useState<string | null>(null);

  const totalRecords = daily.reduce((sum, day) => sum + day.records.length, 0);

  return (
    <DashPanel className="!p-0 overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-brand/12 px-5 py-4 sm:px-6 dark:border-white/10">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/12 bg-brand/5 text-brand dark:border-white/10 dark:bg-white/5">
            <Activity className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-foreground sm:text-lg">
              {t.dashboard.activityLog}
            </h2>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
              {period?.start && period?.end
                ? `${formatPeriodDate(period.start)} — ${formatPeriodDate(period.end)}`
                : 'آخر النشاطات في غرف المكتب'}
              {!isLoading && !error && totalRecords > 0
                ? ` · ${totalRecords} سجل`
                : null}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand/15 px-2.5 py-1.5 text-[11px] font-bold text-brand transition hover:bg-brand/5 disabled:opacity-50 cursor-pointer dark:border-white/15"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </div>

      <div className="max-h-[min(68vh,640px)] overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-[4.5rem] animate-pulse rounded-xl bg-brand/5 dark:bg-white/5"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-6 text-center">
            <p className="text-sm text-danger">{error}</p>
            <button
              type="button"
              onClick={refresh}
              className="mt-3 text-xs font-bold text-brand hover:opacity-80 cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : daily.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand/20 px-4 py-10 text-center dark:border-white/15">
            <Activity className="mx-auto h-8 w-8 text-brand/40" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-semibold text-foreground">
              لا توجد نشاطات في الفترة الحالية
            </p>
            <p className="mt-1 text-xs text-muted">
              ستظهر هنا محادثاتك وتحليلاتك ومقالاتك فور تسجيل أي نشاط.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {daily.map((day) => (
              <section key={day.date}>
                <div className="sticky top-0 z-[1] -mx-1 mb-3 flex items-center gap-2 bg-card/95 px-1 py-1.5 backdrop-blur-sm dark:bg-[rgba(23,31,51,0.92)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <h3 className="text-sm font-bold text-foreground">{day.label}</h3>
                  <span className="text-[11px] text-muted">{day.date}</span>
                  <span className="ms-auto rounded-full bg-brand/8 px-2 py-0.5 text-[10px] font-bold text-brand dark:bg-brand/20">
                    {day.records.length}
                  </span>
                </div>

                <div className="relative ms-2 space-y-2.5 border-s border-brand/20 ps-4 dark:border-white/10">
                  {day.records.map((record, index) => {
                    const key =
                      record.id ||
                      `${day.date}:${record.timestamp}:${record.type}:${index}`;
                    return (
                      <ActivityItem
                        key={key}
                        record={record}
                        expanded={selected === key}
                        expandLabel={t.dashboard.expand}
                        collapseLabel={t.dashboard.collapse}
                        onToggle={() =>
                          setSelected(selected === key ? null : key)
                        }
                      />
                    );
                  })}
                </div>
              </section>
            ))}

            {hasMore ? (
              <div className="border-t border-brand/10 pt-4 text-center dark:border-white/10">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="rounded-lg bg-brand px-5 py-2 text-xs font-bold text-on-brand transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
                >
                  {isLoadingMore
                    ? 'جاري التحميل…'
                    : `عرض المزيد (${pagination.page}/${pagination.pages})`}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </DashPanel>
  );
}
