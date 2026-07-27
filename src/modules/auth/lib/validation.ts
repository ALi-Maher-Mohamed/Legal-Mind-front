import type { RegisterDraft, TeamSizeValue } from '@/types/auth.types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;
const TEAM_SIZES: TeamSizeValue[] = ['solo', 'small', 'medium', 'large'];

export type PasswordRuleId = 'minLength' | 'lowercase' | 'uppercase' | 'number';

export type PasswordRule = {
  id: PasswordRuleId;
  label: string;
  passed: boolean;
};

export function getPasswordRules(password: string): PasswordRule[] {
  return [
    {
      id: 'minLength',
      label: 'يجب ألا تقل كلمة المرور عن 8 أحرف',
      passed: password.length >= 8,
    },
    {
      id: 'lowercase',
      label: 'حرف صغير واحد على الأقل (a-z)',
      passed: /[a-z]/.test(password),
    },
    {
      id: 'uppercase',
      label: 'حرف كبير واحد على الأقل (A-Z)',
      passed: /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: 'رقم واحد على الأقل (0-9)',
      passed: /[0-9]/.test(password),
    },
  ];
}

export function isPasswordValid(password: string): boolean {
  return password.length >= 8 && PASSWORD_PATTERN.test(password);
}

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return 'البريد الإلكتروني مطلوب';
  if (!EMAIL_RE.test(value)) return 'يرجى إدخال بريد إلكتروني صالح';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'كلمة المرور مطلوبة';
  if (password.length < 8) return 'يجب ألا تقل كلمة المرور عن 8 أحرف';
  if (!PASSWORD_PATTERN.test(password)) {
    return 'يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم واحد على الأقل';
  }
  return null;
}

export function validateLogin(email: string, password: string): string | null {
  return validateEmail(email) || (password ? null : 'كلمة المرور مطلوبة');
}

export function validateForgotPassword(email: string): string | null {
  return validateEmail(email);
}

export function validateResetPassword(token: string, password: string): string | null {
  if (!token.trim()) return 'رمز إعادة التعيين مطلوب';
  return validatePassword(password);
}

export function validateResendVerification(email: string): string | null {
  return validateEmail(email);
}

export function validateRegisterStep(step: number, draft: RegisterDraft): string | null {
  if (step === 1) {
    const name = draft.name.trim();
    if (!name) return 'الاسم الكامل مطلوب';
    if (name.length < 2) return 'يجب ألا يقل الاسم الكامل عن حرفين';
    if (name.length > 100) return 'يجب ألا يتجاوز الاسم الكامل 100 حرف';
    return validateEmail(draft.email);
  }

  if (step === 2) {
    return validatePassword(draft.password);
  }

  if (step === 3) {
    const office = draft.firmName.trim();
    if (!office) return 'اسم المكتب أو الشركة القانونية مطلوب';
    if (office.length > 200) return 'يجب ألا يتجاوز اسم المكتب 200 حرف';
    if (!TEAM_SIZES.includes(draft.teamSize)) {
      return 'يجب أن يكون حجم الفريق أحد الخيارات التالية: فردي، صغير، متوسط، كبير';
    }
    if (!draft.lawyerIdDocument) return 'ارفع مستند هوية المحامي';
  }

  return null;
}
