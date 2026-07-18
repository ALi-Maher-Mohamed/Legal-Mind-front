'use client';

import { useLanguage } from '@/hooks/useLanguage';
import type { DashboardView } from '@/types/dashboard.types';
import { DASH_NAV_ITEMS } from '../../data/navItems';

type Props = {
  view: DashboardView;
  onNavigate: (view: DashboardView) => void;
  variant?: 'sidebar' | 'mobile';
};

export default function SidebarNav({ view, onNavigate, variant = 'sidebar' }: Props) {
  const { t } = useLanguage();
  const mobile = variant === 'mobile';

  if (mobile) {
    return (
      <div className="flex gap-1 overflow-x-auto border-b border-outline/40 px-3 py-2 md:hidden">
        {DASH_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                active ? 'bg-brand text-on-brand' : 'bg-surface-raised text-muted'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.dashboard[item.labelKey]}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="flex-1 space-y-1 p-3">
      {DASH_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition cursor-pointer text-start ${
              active
                ? 'bg-brand text-on-brand shadow-[0_2px_8px_rgba(0,62,199,0.2)]'
                : 'text-muted hover:bg-surface-raised hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {t.dashboard[item.labelKey]}
          </button>
        );
      })}
    </nav>
  );
}
