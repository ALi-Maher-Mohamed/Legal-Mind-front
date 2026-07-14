// src/hooks/useLanguage.ts
'use client';

import { useLanguageContext } from '@/lib/providers/LanguageProvider';

export function useLanguage() {
  const { locale, setLocale, t, isRtl } = useLanguageContext();
  
  return {
    locale,
    setLocale,
    t,
    isRtl,
    toggleLanguage: () => setLocale(locale === 'en' ? 'ar' : 'en')
  };
}
