// src/hooks/useLanguage.ts
'use client';

import { useLanguageContext } from '@/lib/providers/LanguageProvider';

export function useLanguage() {
  const { locale, t, isRtl, dir } = useLanguageContext();

  return {
    locale,
    t,
    isRtl,
    dir,
  };
}
