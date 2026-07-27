'use client';

import { useId } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

type Props = {
  size?: 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
};

const ICON_SIZE = {
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
  xl: 'h-20 w-20',
} as const;

const TEXT_SIZE = {
  md: 'text-xl',
  lg: 'text-2xl sm:text-3xl',
  xl: 'text-3xl sm:text-4xl',
} as const;

export default function BrandMark({
  size = 'lg',
  showWordmark = true,
  className = '',
  iconClassName = '',
  wordmarkClassName = '',
}: Props) {
  const { t } = useLanguage();
  const gradId = useId().replace(/:/g, '');

  return (
    <div className={`flex flex-col items-center gap-4 select-none ${className}`}>
      <svg
        className={`${ICON_SIZE[size]} shrink-0 ${iconClassName}`}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <path
          d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z"
          stroke={`url(#${gradId})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="35" r="5.5" fill="var(--lm-accent)" />
        <path
          d="M35 52 L65 52"
          stroke="var(--lm-brand)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M50 35 L50 65" stroke={`url(#${gradId})`} strokeWidth="5" />
        <path
          d="M42 65 L58 65"
          stroke="var(--lm-accent)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="var(--lm-brand)" />
            <stop offset="100%" stopColor="var(--lm-brand-deep)" />
          </linearGradient>
        </defs>
      </svg>

      {showWordmark ? (
        <p
          className={`${TEXT_SIZE[size]} font-bold tracking-tight text-foreground leading-none ${wordmarkClassName}`}
        >
          {t.common.brandName}
          <span className="ms-1.5 text-brand">{t.common.brandSuffix}</span>
        </p>
      ) : null}
    </div>
  );
}
