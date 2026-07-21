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
    <div className="space-y-4">
      <div className="flex flex-col gap-4 border-b border-brand/15 pb-6 md:flex-row md:items-center md:justify-between dark:border-white/10">
        <div className="text-start">
          <span className="block text-xs font-semibold uppercase tracking-wider text-brand">
            {t.dashboard.chambersOf} {user.firmName}
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {t.dashboard.goodMorning.replace('{name}', firstName)}
          </h1>
        </div>

        <div className={`relative overflow-hidden px-4 py-3 text-end ${dashChip}`}>
          <div className={dashAccentBarGold} />
          <span className="block text-xs font-semibold text-foreground">{todayLabel}</span>
          <span className="mt-0.5 block text-[11px] text-brand">{todayAlt}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onToggleEmpty}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-brand hover:bg-brand/5 cursor-pointer ${dashChip}`}
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {t.dashboard.toggleDesk}: {showEmpty ? t.dashboard.deskFilled : t.dashboard.deskClear}
        </button>
      </div>
    </div>
  );
}
