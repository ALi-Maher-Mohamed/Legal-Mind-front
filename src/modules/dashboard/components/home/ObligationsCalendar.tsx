'use client';

import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getDeskObligations } from '../../data/obligations.data';
import DashPanel from '../ui/DashPanel';
import ObligationRow from './ObligationRow';

const HIGHLIGHTED = [14, 22, 28];

export default function ObligationsCalendar() {
  const { t, locale } = useLanguage();
  const obligations = useMemo(() => getDeskObligations(locale), [locale]);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = new Date().getDate();
  const weekdays =
    locale === 'ar'
      ? ['إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد']
      : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <DashPanel>
      <div className="mb-4 flex items-center justify-between border-b border-brand/15 pb-3 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            {t.dashboard.calendarTitle}
          </span>
        </div>
        <span className="text-[10px] font-semibold italic text-accent">{t.dashboard.calendarMonth}</span>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-muted">
        {weekdays.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-foreground">
        <div />
        <div />
        {days.map((day) => {
          const marked = HIGHLIGHTED.includes(day);
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`relative flex items-center justify-center rounded-md py-1 ${
                isToday ? 'bg-brand text-on-brand font-bold' : ''
              } ${marked && !isToday ? 'border border-brand/40 text-brand font-bold bg-[#f0f4ff] dark:bg-brand/15' : ''}`}
            >
              {day}
              {marked && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-accent" />}
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-3.5 border-t border-brand/15 pt-4 dark:border-white/10">
        {obligations.map((ob) => (
          <ObligationRow
            key={ob.title}
            obligation={ob}
            dayLabel={locale === 'ar' ? `${ob.day} يوليو` : `Jul ${ob.day}`}
          />
        ))}
      </div>
    </DashPanel>
  );
}
