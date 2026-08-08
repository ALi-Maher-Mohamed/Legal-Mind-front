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

export function getErrorMessage(error: unknown, fallback = 'حدث خطأ غير متوقع'): string {
  if (error instanceof ApiError) {
    return resolveApiErrorMessage(error.message, error.errors, fallback);
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
