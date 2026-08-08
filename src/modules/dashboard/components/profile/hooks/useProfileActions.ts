'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import type { AuthUser, TeamSizeValue, UpdateProfilePayload } from '@/types/auth.types';
import { validateAvatarFile } from '../lib/avatarUpload';

export function useProfileActions(
  onUserUpdate: (user: AuthUser) => void,
) {
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
      toastApiSuccess(result.message);
      return true;
    } catch (error) {
      toastApiError(error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    // Local file rules only — no inventing API messages.
    if (validateAvatarFile(file)) return false;

    setIsUploadingAvatar(true);
    try {
      const result = await usersService.uploadAvatar(file);
      onUserUpdate(result.user);
      toastApiSuccess(result.message);
      return true;
    } catch (error) {
      toastApiError(error);
      return false;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const logoutAllDevices = async () => {
    setIsLoggingOutAll(true);
    try {
      const result = await authService.logoutAll();
      toastApiSuccess(result.message);
      router.replace(ROUTES.login);
    } catch (error) {
      toastApiError(error);
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
