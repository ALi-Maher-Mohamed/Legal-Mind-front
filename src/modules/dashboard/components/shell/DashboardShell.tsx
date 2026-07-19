'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/config/routes';
import type { AuthUser } from '@/types/auth.types';
import type { DashboardView } from '@/types/dashboard.types';
import { dashPageBg } from '../../lib/panelStyles';
import DashboardTopBar from './DashboardTopBar';
import DashboardBottomNav from './DashboardBottomNav';

type Props = {
  user: AuthUser;
  view: DashboardView;
  onNavigate: (view: DashboardView) => void;
  children: React.ReactNode;
};

export default function DashboardShell({ user, view, onNavigate, children }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    authService.clearSession();
    router.push(ROUTES.login);
  };

  return (
    <div className={`flex min-h-screen flex-col text-foreground ${dashPageBg}`}>
      <DashboardTopBar user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-4 pb-28 sm:p-6 sm:pb-32 lg:p-8 lg:pb-32">
        {children}
      </main>
      <DashboardBottomNav view={view} onNavigate={onNavigate} />
    </div>
  );
}
