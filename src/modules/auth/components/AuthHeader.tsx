'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import AuthToolbar from './AuthToolbar';

export default function AuthHeader() {
  const { t, isRtl } = useLanguage();
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <header className="relative z-20 space-y-5 mb-6">
      <div className="flex items-center justify-between gap-3">
        <Link href={ROUTES.home} className="flex items-center gap-2 group select-none shrink-0">
          <svg className="h-8 w-8" viewBox="0 0 100 100" fill="none" aria-hidden>
            <path
              d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z"
              stroke="url(#auth-logo-grad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="35" r="5" fill="var(--lm-accent)" />
            <path d="M35 52 L65 52" stroke="var(--lm-brand)" strokeWidth="4" strokeLinecap="round" />
            <path d="M50 35 L50 65" stroke="url(#auth-logo-grad)" strokeWidth="4" />
            <defs>
              <linearGradient id="auth-logo-grad" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="var(--lm-brand)" />
                <stop offset="100%" stopColor="var(--lm-brand-soft)" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-base font-bold tracking-tight text-foreground group-hover:text-brand transition">
            LegalMind<span className="text-accent ms-0.5">AI</span>
          </span>
        </Link>
        <AuthToolbar />
      </div>

      <Link
        href={ROUTES.home}
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-brand transition"
      >
        <BackIcon className="h-3.5 w-3.5" />
        {t.auth.backHome}
      </Link>
    </header>
  );
}
