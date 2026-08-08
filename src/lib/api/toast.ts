import toast from 'react-hot-toast';
import { getErrorMessage } from './errors';

/** Show backend success `message` only — no toast when the API returns none. */
export function toastApiSuccess(message?: string | null) {
  const text = message?.trim();
  if (!text) return;
  toast.success(text);
}

/**
 * Show backend error `message` only.
 * Fallback is used only for non-API failures (network, local validation).
 */
export function toastApiError(error: unknown, fallback = '') {
  const text = getErrorMessage(error, fallback).trim();
  if (!text) return;
  toast.error(text);
}
