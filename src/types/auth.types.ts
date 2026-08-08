export type AuthMode = 'login' | 'register' | 'onboarding' | 'forgot' | 'reset';

export type TeamSizeValue = 'solo' | 'small' | 'medium' | 'large';

/** API public user shape from backend-ts. */
export type PublicUser = {
  id: string;
  fullName: string;
  email: string;
  officeName: string;
  teamSize: TeamSizeValue | string;
  phone?: string;
  barAssociationNumber?: string;
  avatarUrl: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
};

/** UI-facing user with local display mappings. */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'lawyer';
  firmName: string;
  barId: string;
  phone: string;
  avatarUrl: string;
  practiceAreas: string[];
  teamSize: string;
  isEmailVerified: boolean;
  isActive: boolean;
  organizationId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

/** @deprecated Use PublicUser — kept as alias during migration. */
export type ApiUser = PublicUser;

export type UpdateProfilePayload = {
  fullName: string;
  officeName: string;
  barAssociationNumber: string;
  phone: string;
  teamSize: TeamSizeValue;
};

export type RegisterDraft = {
  name: string;
  email: string;
  password: string;
  phone: string;
  firmName: string;
  barId: string;
  teamSize: TeamSizeValue;
  selectedPractices: string[];
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type AuthSessionResponse = {
  access_token: string;
  user: PublicUser;
  message?: string;
};

export type AuthSessionPayload = {
  user: AuthUser;
  accessToken: string;
  message?: string;
};
