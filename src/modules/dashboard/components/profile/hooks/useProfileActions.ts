'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import type { AuthUser } from '@/types/auth.types';

export function useProfileActions(
  onUserUpdate: (user: AuthUser) => void,
) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const refreshProfile = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await authService.me();
      onUserUpdate(fresh);
      toastApiSuccess(t.dashboard.profileRefreshed);
    } catch (error) {
      toastApiError(error, t.dashboard.profileRefreshError);
    } finally {
      setIsRefreshing(false);
    }
  };

  const logoutAllDevices = async () => {
    setIsLoggingOutAll(true);
    try {
      const result = await authService.logoutAll();
      toastApiSuccess(result.message || t.dashboard.profileLogoutAllTitle);
      router.replace(ROUTES.login);
    } catch (error) {
      toastApiError(error, t.dashboard.profileLogoutAllError);
      setIsLoggingOutAll(false);
      setLogoutAllOpen(false);
    }
  };

  return {
    isRefreshing,
    logoutAllOpen,
    isLoggingOutAll,
    setLogoutAllOpen,
    refreshProfile,
    logoutAllDevices,
  };
}
