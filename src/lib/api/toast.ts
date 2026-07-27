import toast from 'react-hot-toast';
import { getErrorMessage } from './errors';

export function toastApiSuccess(message?: string | null) {
  const text = message?.trim();
  if (!text) return;
  toast.success(text);
}

export function toastApiError(error: unknown, fallback = 'حدث خطأ غير متوقع') {
  toast.error(getErrorMessage(error, fallback));
}
