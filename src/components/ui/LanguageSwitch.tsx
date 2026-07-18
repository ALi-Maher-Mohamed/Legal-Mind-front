'use client';

import { useLanguage } from '@/hooks/useLanguage';
import type { Locale } from '@/config/translations';

type Props = {
  /** Short labels: EN / عر */
  compact?: boolean;
  /** Stretch to container width (drawer menus) */
  fullWidth?: boolean;
  className?: string;
  /** Optional overrides — defaults to useLanguage() */
  locale?: Locale;
  onToggle?: () => void;
};

/**
 * Shared language switch — same look as landing Navbar.
 * Use across landing, auth, and dashboard.
 */
export default function LanguageSwitch({
  compact = false,
  fullWidth = false,
  className = '',
  locale: localeProp,
  onToggle: onToggleProp,
}: Props) {
  const lang = useLanguage();
  const locale = localeProp ?? lang.locale;
  const onToggle = onToggleProp ?? lang.toggleLanguage;
  const isAr = locale === 'ar';

  return (
    <button
      type="button"
      role="switch"
      dir="ltr"
      aria-checked={isAr}
      aria-label={isAr ? 'Switch to English' : 'التبديل للعربية'}
      onClick={onToggle}
      className={`relative inline-flex items-center rounded-full border border-outline/50 bg-surface-raised p-1 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
        fullWidth ? 'h-11 w-full' : compact ? 'h-9 w-[5.75rem]' : 'h-9 min-w-[8.5rem]'
      } ${className}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute top-1 bottom-1 start-1 w-[calc(50%-4px)] rounded-full bg-brand shadow-[0_1px_4px_rgba(0,62,199,0.35)] transition-transform duration-200 ease-out ${
          isAr ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      <span
        className={`relative z-10 flex flex-1 items-center justify-center px-1 text-center font-semibold transition-colors ${
          fullWidth ? 'text-sm' : 'text-[11px]'
        } ${!isAr ? 'text-on-brand' : 'text-muted'}`}
      >
        {compact ? 'EN' : 'English'}
      </span>
      <span
        className={`relative z-10 flex flex-1 items-center justify-center px-1 text-center font-semibold transition-colors ${
          fullWidth ? 'text-sm' : 'text-[11px]'
        } ${isAr ? 'text-on-brand' : 'text-muted'}`}
      >
        {compact ? 'عر' : 'العربية'}
      </span>
    </button>
  );
}
