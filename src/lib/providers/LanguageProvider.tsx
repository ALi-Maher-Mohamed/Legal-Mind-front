// src/lib/providers/LanguageProvider.tsx
'use client';

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Locale, translations } from '@/config/translations';

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.en;
  isRtl: boolean;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

function applyDocumentLocale(locale: Locale) {
  if (typeof document === 'undefined') return;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const root = document.documentElement;
  root.setAttribute('dir', dir);
  root.setAttribute('lang', locale);
  root.setAttribute('data-locale', locale);
  root.style.direction = dir;
  document.body?.setAttribute('dir', dir);
  if (document.body) document.body.style.direction = dir;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const storedLocale = window.localStorage.getItem('locale') as Locale;
      if (storedLocale === 'en' || storedLocale === 'ar') {
        return storedLocale;
      }
    }
    return 'ar';
  });

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const isRtl = locale === 'ar';

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    applyDocumentLocale(newLocale);
  }, []);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRtl, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}
