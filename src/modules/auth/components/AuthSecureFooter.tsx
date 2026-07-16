'use client';

import { Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function AuthSecureFooter() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 border-t border-white/5 pt-4 mt-8">
      <Shield className="h-3.5 w-3.5 text-blue-400" aria-hidden />
      <span>{t.auth.secureFooter}</span>
    </div>
  );
}
