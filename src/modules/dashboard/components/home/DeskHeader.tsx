'use client';

import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';
import { formatLocaleDate } from '../../lib/formatDate';
import { dashAccentBarGold, dashChip } from '../../lib/panelStyles';

type Props = {
  user: AuthUser;
  showEmpty: boolean;
  onToggleEmpty: () => void;
};

export default function DeskHeader({ user, showEmpty, onToggleEmpty }: Props) {
  const { t } = useLanguage();
  const firstName = user.name.split(' ')[0] || user.name;
  const todayLabel = useMemo(() => formatLocaleDate(), []);
  const todayAlt = useMemo(() => formatLocaleDate(true), []);

  return (
    <div className="flex flex-col gap-4 border-b border-brand/12 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
      <div className="min-w-0 text-start">
        <span className="block text-xs font-semibold uppercase tracking-wider text-brand">
          {t.dashboard.chambersOf} {user.firmName}
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t.dashboard.goodMorning.replace('{name}', firstName)}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <div className={`relative overflow-hidden px-4 py-2.5 text-end ${dashChip}`}>
          <div className={dashAccentBarGold} />
          <span className="block text-xs font-semibold text-foreground">{todayLabel}</span>
          <span className="mt-0.5 block text-[11px] text-brand">{todayAlt}</span>
        </div>
        <button
          type="button"
          onClick={onToggleEmpty}
          className={`inline-flex items-center gap-1.5 px-2.5 py-2 text-[11px] text-muted hover:bg-brand/5 hover:text-brand cursor-pointer ${dashChip}`}
          title={t.dashboard.toggleDesk}
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {showEmpty ? t.dashboard.deskFilled : t.dashboard.deskClear}
        </button>
      </div>
    </div>
  );
}
