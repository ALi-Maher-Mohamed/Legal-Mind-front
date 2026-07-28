'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import type { AuthUser, TeamSizeValue, UpdateProfilePayload } from '@/types/auth.types';
import { validateAvatarFile } from '../lib/avatarUpload';

export function useProfileActions(
  onUserUpdate: (user: AuthUser) => void,
) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const saveProfile = async (payload: UpdateProfilePayload) => {
    setIsSaving(true);
    try {
      const result = await usersService.updateProfile(payload);
      onUserUpdate(result.user);
      toastApiSuccess(result.message || t.dashboard.profileSaveSuccess);
      return true;
    } catch (error) {
      toastApiError(error, t.dashboard.profileSaveError);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    const validationKey = validateAvatarFile(file);
    if (validationKey === 'avatarTypeError') {
      toastApiError(null, t.dashboard.profileAvatarTypeError);
      return false;
    }
    if (validationKey === 'avatarSizeError') {
      toastApiError(null, t.dashboard.profileAvatarSizeError);
      return false;
    }

    setIsUploadingAvatar(true);
    try {
      const result = await usersService.uploadAvatar(file);
      onUserUpdate(result.user);
      toastApiSuccess(result.message || t.dashboard.profileAvatarSuccess);
      return true;
    } catch (error) {
      toastApiError(error, t.dashboard.profileAvatarError);
      return false;
    } finally {
      setIsUploadingAvatar(false);
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
    isSaving,
    isUploadingAvatar,
    logoutAllOpen,
    isLoggingOutAll,
    setLogoutAllOpen,
    saveProfile,
    uploadAvatar,
    logoutAllDevices,
  };
}

export type ProfileEditDraft = {
  fullName: string;
  officeName: string;
  barAssociationNumber: string;
  phone: string;
  teamSize: TeamSizeValue;
};
