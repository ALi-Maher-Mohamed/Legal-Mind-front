export class ApiError extends Error {
  readonly status: number;
  readonly errors: unknown;
  readonly errorCode: string | null;
  readonly requestId: string | null;

  constructor(
    message: string,
    status = 500,
    errors: unknown = null,
    options: { errorCode?: string | null; requestId?: string | null } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.errorCode = options.errorCode ?? null;
    this.requestId = options.requestId ?? null;
  }
}

/** Backend auth error codes from FRONTEND_API_INTEGRATION.md */
export const AuthErrorCode = {
  REQUIRED: 'AUTH_REQUIRED',
  INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'AUTH_EMAIL_NOT_VERIFIED',
  ACCOUNT_DISABLED: 'AUTH_ACCOUNT_DISABLED',
  REFRESH_INVALID: 'AUTH_REFRESH_TOKEN_INVALID',
  REFRESH_REUSED: 'AUTH_REFRESH_TOKEN_REUSED',
  INSUFFICIENT_ROLE: 'AUTH_INSUFFICIENT_ROLE',
  EMAIL_EXISTS: 'AUTH_EMAIL_ALREADY_EXISTS',
  RESET_INVALID: 'AUTH_RESET_TOKEN_INVALID',
  RATE_LIMITED: 'AUTH_RATE_LIMITED',
} as const;

/** 401 codes that should trigger a single refresh + retry. */
export const REFRESHABLE_AUTH_CODES = new Set<string>([
  AuthErrorCode.TOKEN_EXPIRED,
  AuthErrorCode.INVALID_TOKEN,
  AuthErrorCode.REQUIRED,
]);

type FieldError = {
  field?: string;
  message?: string;
};

function extractDetailMessages(errors: unknown): string[] {
  if (!errors) return [];

  if (Array.isArray(errors)) {
    return errors
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object' && 'message' in item) {
          const message = (item as FieldError).message;
          return typeof message === 'string' ? message.trim() : '';
        }
        return '';
      })
      .filter(Boolean);
  }

  if (typeof errors === 'object') {
    const details = errors as {
      fields?: Record<string, string[]>;
      issues?: Array<{ field: string; message: string; code: string }>;
    };

    if (Array.isArray(details.issues)) {
      return details.issues
        .map((issue) => issue?.message?.trim())
        .filter((message): message is string => Boolean(message));
    }

    if (details.fields && typeof details.fields === 'object') {
      return Object.values(details.fields)
        .flat()
        .map((message) => (typeof message === 'string' ? message.trim() : ''))
        .filter(Boolean);
    }
  }

  return [];
}

/** Prefer field-level API messages over generic envelopes like "Validation error". */
export function resolveApiErrorMessage(
  message?: string | null,
  errors?: unknown,
  fallback = 'حدث خطأ غير متوقع',
): string {
  const details = extractDetailMessages(errors);
  if (details.length === 1) return details[0];
  if (details.length > 1) return details.join(' · ');

  const topLevel = message?.trim();
  if (topLevel) return topLevel;

  return fallback;
}

/** Map known backend auth codes to Arabic UX copy when the API message is English. */
export function resolveAuthErrorMessage(
  error: unknown,
  fallback = 'حدث خطأ غير متوقع',
): string {
  if (!(error instanceof ApiError) || !error.errorCode) {
    return getErrorMessage(error, fallback);
  }

  switch (error.errorCode) {
    case AuthErrorCode.INVALID_CREDENTIALS:
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    case AuthErrorCode.EMAIL_NOT_VERIFIED:
      return 'يرجى تفعيل بريدك الإلكتروني قبل تسجيل الدخول';
    case AuthErrorCode.ACCOUNT_DISABLED:
      return 'تم تعطيل هذا الحساب. تواصل مع الدعم إن لزم الأمر';
    case AuthErrorCode.RATE_LIMITED:
      return 'محاولات كثيرة. يرجى الانتظار قليلاً ثم المحاولة مجدداً';
    case AuthErrorCode.EMAIL_EXISTS:
      return 'هذا البريد مسجّل مسبقاً';
    case AuthErrorCode.RESET_INVALID:
      return 'رابط إعادة تعيين كلمة المرور غير صالح أو منتهٍ';
    case AuthErrorCode.REFRESH_INVALID:
    case AuthErrorCode.REFRESH_REUSED:
      return 'انتهت الجلسة. سجّل الدخول مجدداً';
    case AuthErrorCode.TOKEN_EXPIRED:
    case AuthErrorCode.INVALID_TOKEN:
    case AuthErrorCode.REQUIRED:
      return 'انتهت صلاحية الجلسة. سجّل الدخول مجدداً';
    default:
      return getErrorMessage(error, fallback);
  }
}

export function getErrorMessage(error: unknown, fallback = 'حدث خطأ غير متوقع'): string {
  if (error instanceof ApiError) {
    return resolveApiErrorMessage(error.message, error.errors, fallback);
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
