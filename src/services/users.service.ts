import { api } from '@/lib/api/client';
import { sessionStore } from '@/lib/api/session';
import { mapApiUserToAuthUser } from '@/modules/auth/lib/mapAuthUser';
import type { ApiUser, AuthUser, UpdateProfilePayload } from '@/types/auth.types';

type UserEnvelope = { user: ApiUser };

function persistMappedUser(apiUser: ApiUser): AuthUser {
  const practiceAreas = sessionStore.getUser()?.practiceAreas ?? [];
  const user = mapApiUserToAuthUser(apiUser, practiceAreas);
  const token = sessionStore.getAccessToken();
  if (token) {
    sessionStore.persist(user, token, {
      refreshToken: sessionStore.getRefreshToken(),
    });
  }
  return user;
}

export const usersService = {
  async updateProfile(
    payload: UpdateProfilePayload,
  ): Promise<{ user: AuthUser; message: string }> {
    const response = await api.patch<UserEnvelope>(
      '/api/users/profile',
      {
        json: {
          fullName: payload.fullName.trim(),
          officeName: payload.officeName.trim(),
          barAssociationNumber: payload.barAssociationNumber.trim(),
          phone: payload.phone.trim(),
          teamSize: payload.teamSize,
        },
      },
      { auth: true },
    );

    return {
      user: persistMappedUser(response.data.user),
      message: response.message,
    };
  },

  async uploadAvatar(file: File): Promise<{ user: AuthUser; message: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<UserEnvelope>(
      '/api/users/profile/avatar',
      { formData },
      { auth: true },
    );

    return {
      user: persistMappedUser(response.data.user),
      message: response.message,
    };
  },
};
