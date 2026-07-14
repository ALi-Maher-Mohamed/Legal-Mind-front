import { Locale } from '@/config/translations';

export function formatChatTime(locale: Locale) {
  return new Date().toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
