'use client';

import { useMemo, useState } from 'react';
import {
  FileText,
  Calendar,
  ArrowUpRight,
  Scale,
  ChevronRight,
  BookOpen,
  Inbox,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';
import type { DashboardView, LegalDocument } from '@/types/dashboard.types';
import { getDeskActivities, getDeskObligations } from '../data/deskContent';

type Props = {
  user: AuthUser;
  documents: LegalDocument[];
  onNavigate: (view: DashboardView) => void;
};

export default function DashboardHome({ user, documents, onNavigate }: Props) {
  const { t, locale, isRtl } = useLanguage();
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [showEmptyDesk, setShowEmptyDesk] = useState(false);

  const firstName = user.name.split(' ')[0] || user.name;
  const activities = useMemo(() => getDeskActivities(locale), [locale]);
  const obligations = useMemo(() => getDeskObligations(locale), [locale]);

  const docsAnalyzedCount = documents.filter((d) => d.status === 'Analysis Complete').length;
  const activeCasesCount = documents.length;

  const todayLabel = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [locale]);

  const todayAlt = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(locale === 'ar' ? 'en-US' : 'ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [locale]);

  const stats = [
    {
      label: t.dashboard.stat1Title,
      value: docsAnalyzedCount,
      change: locale === 'ar' ? '+١٤٪ مقارنة بالشهر السابق' : '+14% vs prior mo',
      icon: <FileText className="h-5 w-5 text-brand" strokeWidth={2.25} />,
    },
    {
      label: t.dashboard.stat2Title,
      value: activeCasesCount,
      change: locale === 'ar' ? '+٢ تم تسجيلها اليوم' : '+2 registered today',
      icon: <Scale className="h-5 w-5 text-brand" strokeWidth={2.25} />,
    },
    {
      label: t.dashboard.stat3Title,
      value: 8,
      change: locale === 'ar' ? 'دقة صياغية عالية' : 'Uncompromising precision',
      icon: <BookOpen className="h-5 w-5 text-brand" strokeWidth={2.25} />,
    },
  ];

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const highlightedDays = [14, 22, 28];
  const todayDay = new Date().getDate();

  const weekdays =
    locale === 'ar'
      ? ['إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد']
      : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-outline/40 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="text-start">
          <span className="block text-xs font-semibold uppercase tracking-wider text-brand">
            {t.dashboard.chambersOf} {user.firmName}
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {t.dashboard.goodMorning.replace('{name}', firstName)}
          </h1>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-brand/15 bg-white px-4 py-3 text-end shadow-[0_1px_4px_rgba(0,62,199,0.06)] dark:bg-white/5 dark:border-white/10">
          <div className="absolute inset-y-0 end-0 w-1 bg-accent" />
          <span className="block text-xs font-semibold text-foreground">{todayLabel}</span>
          <span className="mt-0.5 block text-[11px] text-brand">{todayAlt}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowEmptyDesk(!showEmptyDesk)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand/15 bg-white px-2.5 py-1.5 text-xs text-brand hover:bg-[#f0f4ff] dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t.dashboard.toggleDesk}: {showEmptyDesk ? t.dashboard.deskFilled : t.dashboard.deskClear}
        </button>
      </div>

      {showEmptyDesk ? (
        <div className="flex flex-col items-center rounded-2xl border border-brand/15 bg-white p-12 text-center dark:bg-white/5 dark:border-white/10">
          <Inbox className="mb-4 h-12 w-12 text-accent" strokeWidth={1.5} />
          <h2 className="text-xl font-bold text-foreground">{t.dashboard.emptyTitle}</h2>
          <p className="mt-2 max-w-sm text-sm text-muted leading-relaxed">{t.dashboard.uploadFirst}</p>
          <button
            type="button"
            onClick={() => onNavigate('evidence')}
            className="mt-6 rounded-lg bg-brand px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-on-brand hover:opacity-90 cursor-pointer"
          >
            {t.dashboard.enterEvidence}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="relative overflow-hidden rounded-xl border border-brand/15 bg-white p-5 shadow-[0_1px_4px_rgba(0,62,199,0.06)] dark:bg-white/5 dark:border-white/10"
                >
                  <div className="absolute inset-y-0 start-0 w-1 bg-accent" />
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      {s.label}
                    </span>
                    <div className="rounded-lg border border-brand/10 bg-[#f0f4ff] p-1.5 dark:bg-brand/15 dark:border-brand/20">
                      {s.icon}
                    </div>
                  </div>
                  <div className="mt-2 text-3xl font-bold text-foreground">{s.value}</div>
                  <div className="mt-1 text-[11px] text-brand">{s.change}</div>
                </div>
              ))}
            </div>

            <section className="rounded-2xl border border-brand/15 bg-white p-5 shadow-[0_1px_4px_rgba(0,62,199,0.06)] sm:p-6 dark:bg-white/5 dark:border-white/10">
              <div className="mb-4 flex items-center justify-between border-b border-outline/30 pb-4">
                <h2 className="text-lg font-bold text-foreground">{t.dashboard.activeCases}</h2>
                <button
                  type="button"
                  onClick={() => onNavigate('evidence')}
                  className="inline-flex items-center gap-0.5 text-xs text-brand hover:opacity-80 cursor-pointer"
                >
                  {t.dashboard.viewLibrary}
                  <ChevronRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {documents.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted">{t.dashboard.noDocuments}</p>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {documents.map((doc, idx) => {
                    const accents = ['border-s-brand', 'border-s-accent', 'border-s-brand-deep'];
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => onNavigate('evidence')}
                        className={`relative w-52 shrink-0 rounded-xl border border-brand/15 border-s-4 bg-[#f0f4ff] p-4 text-start transition hover:shadow-md dark:bg-white/5 dark:border-white/10 ${accents[idx % accents.length]} cursor-pointer`}
                      >
                        <ArrowUpRight className="absolute top-2 end-2 h-4 w-4 text-brand opacity-0 transition group-hover:opacity-100" />
                        <FileText className="mb-2 h-7 w-7 text-brand" strokeWidth={1.5} />
                        <h3 className="truncate text-xs font-bold uppercase text-foreground">{doc.name}</h3>
                        <p className="mt-1 text-[10px] text-muted">
                          {doc.type} • {doc.size}
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                              doc.status === 'Analysis Complete'
                                ? 'bg-success/10 text-success'
                                : 'bg-accent/15 text-accent'
                            }`}
                          >
                            {doc.status === 'Analysis Complete' ? t.dashboard.audited : t.dashboard.pending}
                          </span>
                          <span className="text-[9px] text-muted">{doc.dateUploaded}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-brand/15 bg-white p-5 shadow-[0_1px_4px_rgba(0,62,199,0.06)] sm:p-6 dark:bg-white/5 dark:border-white/10">
              <h2 className="mb-6 border-b border-outline/30 pb-4 text-lg font-bold text-foreground">
                {t.dashboard.activityLog}
              </h2>
              <div className="relative ms-3 space-y-8 border-s-2 border-brand/20 ps-6">
                {activities.map((act, index) => {
                  const isSelected = selectedActivity === index;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      className="relative block w-full cursor-pointer text-start group"
                      onClick={() => setSelectedActivity(isSelected ? null : index)}
                    >
                      <span className="absolute -start-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand bg-background transition group-hover:bg-accent" />
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                          {act.date} • {act.time}
                        </span>
                        <span className="text-[10px] text-muted group-hover:text-foreground">
                          {isSelected ? t.dashboard.collapse : t.dashboard.expand}
                        </span>
                      </div>
                      <h3 className="mt-1 text-sm font-bold uppercase tracking-tight text-foreground">
                        {act.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{act.desc}</p>
                      {isSelected && (
                        <div className="mt-3 rounded-lg border border-brand/15 border-s-2 border-s-accent bg-[#f0f4ff] p-3 text-xs italic leading-relaxed text-foreground dark:bg-brand/10 dark:border-white/10">
                          {act.detail}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="space-y-8 lg:col-span-4">
            <section className="rounded-2xl border border-white/10 bg-[#0b1326] p-6 text-[#dae2fd] shadow-md">
              <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t.dashboard.calendarTitle}</span>
                </div>
                <span className="text-[10px] font-semibold italic text-accent">{t.dashboard.calendarMonth}</span>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-[#8e9099]">
                {weekdays.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                <div />
                <div />
                {calendarDays.map((day) => {
                  const isHighlighted = highlightedDays.includes(day);
                  const isToday = day === todayDay;
                  return (
                    <div
                      key={day}
                      className={`relative flex items-center justify-center rounded-md py-1 ${
                        isToday ? 'bg-brand text-on-brand font-bold' : ''
                      } ${isHighlighted && !isToday ? 'border border-accent text-accent font-bold' : ''}`}
                    >
                      {day}
                      {isHighlighted && (
                        <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-accent" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3.5 border-t border-white/10 pt-4">
                {obligations.map((ob) => (
                  <div key={ob.title} className="flex items-start gap-2.5">
                    <div className="w-12 shrink-0 rounded-md border border-accent/30 bg-white/5 p-1.5 text-center text-[11px] font-bold text-accent">
                      {locale === 'ar' ? `${ob.day} يوليو` : `Jul ${ob.day}`}
                    </div>
                    <div>
                      <h3 className="flex items-center gap-1 text-xs font-bold uppercase tracking-tight text-white">
                        {ob.title}
                        {ob.level === 'high' && (
                          <AlertTriangle className="inline h-3.5 w-3.5 text-red-400" />
                        )}
                      </h3>
                      <p className="mt-0.5 text-[10px] text-[#8e9099]">{ob.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl border border-brand/15 bg-white p-5 shadow-[0_1px_4px_rgba(0,62,199,0.06)] dark:bg-white/5 dark:border-white/10">
              <div className="pointer-events-none absolute -me-4 -mt-4 end-0 top-0 h-24 w-24 opacity-5">
                <Scale className="h-full w-full text-foreground" />
              </div>
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-brand">
                {t.dashboard.bulletinLabel}
              </span>
              <h3 className="text-sm font-bold uppercase text-foreground">{t.dashboard.bulletinTitle}</h3>
              <p className="mt-2 text-xs italic leading-relaxed text-muted">{t.dashboard.bulletinDesc}</p>
              <button
                type="button"
                onClick={() => onNavigate('gazette')}
                className="mt-4 block text-xs font-bold uppercase tracking-wider text-brand hover:opacity-80 cursor-pointer"
              >
                {t.dashboard.inspectGazette}
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
