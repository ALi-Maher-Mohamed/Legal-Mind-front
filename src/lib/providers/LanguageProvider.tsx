// src/lib/providers/LanguageProvider.tsx
'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { translations, type Locale, type Translations } from '@/config/translations';

interface LanguageContextProps {
  locale: Locale;
  t: Translations;
  isRtl: true;
  dir: 'rtl';
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

function applyArabicDocument() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('dir', 'rtl');
  root.setAttribute('lang', 'ar');
  root.setAttribute('data-locale', 'ar');
  root.style.direction = 'rtl';
  document.body?.setAttribute('dir', 'rtl');
  if (document.body) document.body.style.direction = 'rtl';
  try {
    localStorage.removeItem('locale');
  } catch {
    /* ignore */
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyArabicDocument();
  }, []);

  return (
    <LanguageContext.Provider
      value={{ locale: 'ar', t: translations, isRtl: true, dir: 'rtl' }}
    >
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
