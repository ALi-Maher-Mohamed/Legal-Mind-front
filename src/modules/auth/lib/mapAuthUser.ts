import { resolveMediaUrl } from '@/lib/api/media';
import type { AuthUser, PublicUser } from '@/types/auth.types';

export function mapApiUserToAuthUser(
  user: PublicUser,
  practiceAreas: string[] = [],
): AuthUser {
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    role: 'lawyer',
    firmName: user.officeName || '',
    barId: user.barAssociationNumber || '',
    phone: user.phone || '',
    avatarUrl: resolveMediaUrl(user.avatarUrl) || '',
    practiceAreas,
    teamSize: user.teamSize || 'solo',
    isEmailVerified: Boolean(user.isEmailVerified),
    isActive: user.isActive !== false,
    organizationId: user.organizationId ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
