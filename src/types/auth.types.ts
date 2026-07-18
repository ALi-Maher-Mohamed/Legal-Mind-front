export type AuthMode = 'login' | 'register' | 'onboarding' | 'forgot' | 'otp' | 'reset';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'lawyer';
  firmName: string;
  barId: string;
  avatarUrl: string;
  practiceAreas: string[];
  teamSize: string;
};

export type RegisterDraft = {
  name: string;
  email: string;
  password: string;
  firmName: string;
  barId: string;
  teamSize: string;
  selectedPractices: string[];
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
};
