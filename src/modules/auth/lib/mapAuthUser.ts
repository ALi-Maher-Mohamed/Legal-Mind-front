import type { ApiUser, AuthUser } from '@/types/auth.types';
import { DEFAULT_AVATAR } from '../data/onboarding.data';

export function mapApiUserToAuthUser(
  user: ApiUser,
  practiceAreas: string[] = [],
): AuthUser {
  return {
    id: user.id || user._id || '',
    name: user.displayName || user.fullName,
    email: user.email,
    role: 'lawyer',
    firmName: user.officeName || '',
    barId: user.barAssociationNumber || '',
    phone: user.phone || '',
    avatarUrl: DEFAULT_AVATAR,
    practiceAreas,
    teamSize: user.teamSize || 'small',
    isEmailVerified: Boolean(user.isEmailVerified),
    isActive: user.isActive !== false,
  };
}
