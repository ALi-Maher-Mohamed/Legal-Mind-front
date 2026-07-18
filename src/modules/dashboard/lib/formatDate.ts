import type { Locale } from '@/config/translations';

export function formatLocaleDate(locale: Locale, alt = false) {
  const d = new Date();
  const useAr = alt ? locale !== 'ar' : locale === 'ar';
  return d.toLocaleDateString(useAr ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
