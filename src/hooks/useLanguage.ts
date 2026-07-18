// src/hooks/useLanguage.ts
'use client';

import { useLanguageContext } from '@/lib/providers/LanguageProvider';

export function useLanguage() {
  const { locale, setLocale, t, isRtl, dir } = useLanguageContext();

  return {
    locale,
    setLocale,
    t,
    isRtl,
    dir,
    toggleLanguage: () => setLocale(locale === 'en' ? 'ar' : 'en'),
  };
}
