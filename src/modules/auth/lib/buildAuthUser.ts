import type { AuthUser, RegisterDraft } from '@/types/auth.types';
import type { Locale } from '@/config/translations';
import { DEFAULT_AVATAR } from '../data/onboarding.data';

type BuildAuthUserParams = {
  draft: RegisterDraft;
  loginEmail: string;
  locale: Locale;
};

export function buildAuthUser({ draft, loginEmail, locale }: BuildAuthUserParams): AuthUser {
  const isAr = locale === 'ar';

  return {
    id: `usr-${Math.random().toString(36).substring(2, 9)}`,
    name: draft.name || (isAr ? 'المستشار' : 'Counselor'),
    email: draft.email || loginEmail || 'counselor@firm.com',
    role: 'lawyer',
    firmName: draft.firmName || (isAr ? 'مكتب قانوني' : 'Legal Partners'),
    barId: draft.barId || 'EBA-9941-26',
    avatarUrl: DEFAULT_AVATAR,
    practiceAreas: draft.selectedPractices,
    teamSize: draft.teamSize,
  };
}
