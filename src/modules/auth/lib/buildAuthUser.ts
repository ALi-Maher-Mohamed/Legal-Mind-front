import type { AuthUser, RegisterDraft } from '@/types/auth.types';
import { DEFAULT_AVATAR } from '../data/onboarding.data';

type BuildAuthUserParams = {
  draft: RegisterDraft;
  loginEmail: string;
};

/** Local fallback mapper for onboarding preview when no API user is present. */
export function buildAuthUser({ draft, loginEmail }: BuildAuthUserParams): AuthUser {
  return {
    id: `usr-${Math.random().toString(36).substring(2, 9)}`,
    name: draft.name || 'المستشار',
    email: draft.email || loginEmail || '',
    role: 'lawyer',
    firmName: draft.firmName || 'مكتب قانوني',
    barId: draft.barId || '',
    phone: draft.phone || '',
    avatarUrl: DEFAULT_AVATAR,
    practiceAreas: draft.selectedPractices,
    teamSize: draft.teamSize,
    isEmailVerified: true,
    isActive: true,
  };
}
