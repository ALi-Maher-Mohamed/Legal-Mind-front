'use client';

import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** sm: sidebar/cards · md: panels · lg: full workspace */
  size?: 'sm' | 'md' | 'lg';
  action?: { label: string; onClick: () => void };
  className?: string;
  /** Soft placeholder rows under the empty message (references look). */
  ghostRows?: number;
};

const sizeMap = {
  sm: {
    wrap: 'px-3 py-6',
    iconBox: 'h-11 w-11 rounded-xl',
    icon: 'h-5 w-5',
    title: 'text-xs font-bold',
    desc: 'mt-1.5 text-[11px] leading-relaxed',
    action: 'mt-3 px-3 py-1.5 text-[10px]',
  },
  md: {
    wrap: 'px-4 py-8 sm:px-6',
    iconBox: 'h-14 w-14 rounded-2xl',
    icon: 'h-6 w-6',
    title: 'text-sm font-bold sm:text-base',
    desc: 'mt-2 text-xs leading-relaxed sm:text-sm',
    action: 'mt-4 px-4 py-2 text-[11px]',
  },
  lg: {
    wrap: 'px-6 py-10 sm:px-10 sm:py-14',
    iconBox: 'h-16 w-16 rounded-2xl',
    icon: 'h-7 w-7',
    title: 'text-base font-bold sm:text-lg',
    desc: 'mt-2 max-w-md text-sm leading-relaxed',
    action: 'mt-5 px-5 py-2.5 text-xs',
  },
} as const;

export default function ConsultEmptyState({
  icon: Icon,
  title,
  description,
  size = 'md',
  action,
  className = '',
  ghostRows = 0,
}: Props) {
  const s = sizeMap[size];

  return (
    <div
      className={`flex flex-col items-center text-center ${s.wrap} ${className}`}
      role="status"
    >
      <div className="relative mb-4">
        <div
          className={`flex items-center justify-center border border-brand/15 bg-gradient-to-br from-brand/10 via-[#f0f4ff] to-accent/10 text-brand dark:border-white/10 dark:from-brand/20 dark:via-white/5 dark:to-accent/10 ${s.iconBox}`}
        >
          <Icon className={s.icon} strokeWidth={1.6} aria-hidden />
        </div>
        <span
          className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent dark:border-card"
          aria-hidden
        />
      </div>

      <h4 className={`${s.title} text-foreground`}>{title}</h4>
      {description ? (
        <p className={`${s.desc} max-w-[16rem] text-muted sm:max-w-xs`}>{description}</p>
      ) : null}

      {ghostRows > 0 ? (
        <div className="mt-5 w-full max-w-[14rem] space-y-2 opacity-60" aria-hidden>
          {Array.from({ length: ghostRows }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-dashed border-brand/20 bg-[#f8faff]/70 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="mb-1.5 h-1.5 w-10 rounded bg-brand/15" />
              <div className="mb-1 h-2 w-full rounded bg-brand/10" />
              <div
                className="h-2 rounded bg-brand/10"
                style={{ width: `${70 - i * 12}%` }}
              />
            </div>
          ))}
        </div>
      ) : null}

      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className={`rounded-lg bg-brand font-bold uppercase tracking-wider text-on-brand hover:opacity-90 cursor-pointer ${s.action}`}
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
