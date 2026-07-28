import { resolveMediaUrl } from '@/lib/api/media';
import type { ApiUser, AuthUser } from '@/types/auth.types';

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
    avatarUrl: resolveMediaUrl(user.avatar) || '',
    practiceAreas,
    teamSize: user.teamSize || 'small',
    isEmailVerified: Boolean(user.isEmailVerified),
    isActive: user.isActive !== false,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName || user.fullName,
    lawyerIdDocument: user.lawyerIdDocument,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLogin,
  };
}
