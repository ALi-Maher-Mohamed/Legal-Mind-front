'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/config/routes';
import type { AuthUser } from '@/types/auth.types';
import type { DashboardView } from '@/types/dashboard.types';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';
import SidebarNav from './SidebarNav';

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
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar
        user={user}
        view={view}
        onNavigate={onNavigate}
        onLogout={handleLogout}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar onLogout={handleLogout} />
        <SidebarNav view={view} onNavigate={onNavigate} variant="mobile" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
