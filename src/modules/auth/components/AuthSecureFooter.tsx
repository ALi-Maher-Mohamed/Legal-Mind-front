'use client';

import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function AuthSecureFooter() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 mt-auto pt-6 flex items-center justify-center gap-2 text-[10px] text-muted tracking-wider">
      <ShieldCheck className="h-3.5 w-3.5 text-brand shrink-0" aria-hidden />
      <span>{t.auth.secureFooter}</span>
    </footer>
  );
}
