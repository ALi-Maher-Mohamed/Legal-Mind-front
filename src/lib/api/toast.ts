import toast from 'react-hot-toast';
import { ApiError, getErrorMessage, resolveAuthErrorMessage } from './errors';

export function toastApiSuccess(message?: string | null) {
  const text = message?.trim();
  if (!text) return;
  toast.success(text);
}

export function toastApiError(error: unknown, fallback = 'حدث خطأ غير متوقع') {
  if (error instanceof ApiError && error.errorCode?.startsWith('AUTH_')) {
    toast.error(resolveAuthErrorMessage(error, fallback));
    return;
  }
  toast.error(getErrorMessage(error, fallback));
}
