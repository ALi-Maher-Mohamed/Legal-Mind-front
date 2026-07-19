'use client';

import { useLanguage } from '@/hooks/useLanguage';
import type { DashboardView } from '@/types/dashboard.types';
import { DASH_NAV_ITEMS } from '../../data/navItems';

type Props = {
  view: DashboardView;
  onNavigate: (view: DashboardView) => void;
};

export default function DashboardBottomNav({ view, onNavigate }: Props) {
  const { t } = useLanguage();

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 sm:bottom-6 sm:px-4"
      aria-label={t.dashboard.workspace}
    >
      <div className="pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-2xl border border-brand/15 bg-white/90 p-1.5 shadow-[0_8px_32px_rgba(0,62,199,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-card/90 dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)] sm:gap-1 sm:p-2">
        {DASH_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`inline-flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl px-2.5 py-2 transition cursor-pointer sm:min-w-[4.5rem] sm:px-3 ${
                active
                  ? 'bg-brand text-on-brand shadow-[0_2px_8px_rgba(0,62,199,0.25)]'
                  : 'text-muted hover:bg-[#f0f4ff] hover:text-foreground dark:hover:bg-white/5'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
              <span className="max-w-[4.5rem] truncate text-[9px] font-semibold leading-tight sm:text-[10px]">
                {t.dashboard[item.labelKey]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
