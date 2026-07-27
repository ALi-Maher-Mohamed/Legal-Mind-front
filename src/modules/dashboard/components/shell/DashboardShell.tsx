'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/config/routes';
import { useLanguage } from '@/hooks/useLanguage';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import type { AuthUser } from '@/types/auth.types';
import type { DashboardView } from '@/types/dashboard.types';
import { dashPageBg } from '../../lib/panelStyles';
import ConfirmModal from '../ui/ConfirmModal';
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
  const { t } = useLanguage();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      toastApiSuccess(t.dashboard.logoutSuccess);
      router.push(ROUTES.login);
    } catch (error) {
      toastApiError(error, t.dashboard.logoutError);
      setIsLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  return (
    <div className={`flex min-h-screen flex-col text-foreground ${dashPageBg}`}>
      <DashboardTopBar
        user={user}
        onLogout={() => setLogoutOpen(true)}
        onOpenProfile={() => onNavigate('profile')}
      />
      <main className="flex-1 overflow-y-auto p-4 pb-28 sm:p-6 sm:pb-32 lg:p-8 lg:pb-32">
        {children}
      </main>
      <DashboardBottomNav view={view} onNavigate={onNavigate} />

      <ConfirmModal
        open={logoutOpen}
        title={t.dashboard.logoutConfirmTitle}
        description={t.dashboard.logoutConfirmDesc}
        confirmLabel={t.dashboard.logout}
        cancelLabel={t.dashboard.cancel}
        isLoading={isLoggingOut}
        tone="brand"
        icon={LogOut}
        onCancel={() => {
          if (!isLoggingOut) setLogoutOpen(false);
        }}
        onConfirm={() => void handleLogout()}
      />
    </div>
  );
}
