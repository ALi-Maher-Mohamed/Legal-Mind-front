export type AuthMode = 'login' | 'register' | 'onboarding' | 'forgot' | 'reset';

export type TeamSizeValue = 'small' | 'medium' | 'large' | 'enterprise';

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
};

export type ApiUser = {
  id?: string;
  _id?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email: string;
  officeName: string;
  barAssociationNumber: string;
  lawyerIdDocument?: string;
  teamSize: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
};

export type RegisterDraft = {
  name: string;
  email: string;
  password: string;
  phone: string;
  firmName: string;
  barId: string;
  teamSize: TeamSizeValue;
  lawyerIdDocument: File | null;
  selectedPractices: string[];
};

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type AuthSessionPayload = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string | null;
  message: string;
};
