import type { AuthUser, RegisterDraft } from '@/types/auth.types';
import { DEFAULT_AVATAR } from '../data/onboarding.data';

type BuildAuthUserParams = {
  draft: RegisterDraft;
  loginEmail: string;
};

export function buildAuthUser({ draft, loginEmail }: BuildAuthUserParams): AuthUser {
  return {
    id: `usr-${Math.random().toString(36).substring(2, 9)}`,
    name: draft.name || 'المستشار',
    email: draft.email || loginEmail || 'counselor@firm.com',
    role: 'lawyer',
    firmName: draft.firmName || 'مكتب قانوني',
    barId: draft.barId || 'EBA-9941-26',
    avatarUrl: DEFAULT_AVATAR,
    practiceAreas: draft.selectedPractices,
    teamSize: draft.teamSize,
  };
}
