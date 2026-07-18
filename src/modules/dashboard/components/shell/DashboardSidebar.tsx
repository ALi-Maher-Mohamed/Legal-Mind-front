'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import type { AuthUser } from '@/types/auth.types';
import type { DashboardView } from '@/types/dashboard.types';
import SidebarNav from './SidebarNav';
import SidebarUser from './SidebarUser';

type Props = {
  user: AuthUser;
  view: DashboardView;
  onNavigate: (view: DashboardView) => void;
  onLogout: () => void;
};

export default function DashboardSidebar({ user, view, onNavigate, onLogout }: Props) {
  const { t } = useLanguage();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-e border-outline bg-card dark:border-outline/40">
      <div className="border-b border-outline/40 px-5 py-5">
        <Link href={ROUTES.home} className="block select-none">
          <span className="text-base font-bold tracking-tight text-foreground">
            {t.common.brandName}
            <span className="ms-1 text-brand">{t.common.brandSuffix}</span>
          </span>
        </Link>
        <p className="mt-1 truncate text-[11px] text-muted">
          {user.firmName || t.dashboard.workspace}
        </p>
      </div>
      <SidebarNav view={view} onNavigate={onNavigate} />
      <SidebarUser user={user} onLogout={onLogout} />
    </aside>
  );
}
