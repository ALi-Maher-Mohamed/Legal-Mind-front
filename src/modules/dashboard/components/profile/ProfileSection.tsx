'use client';

import type { LucideIcon } from 'lucide-react';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  title: string;
  icon: LucideIcon;
  iconClassName?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
};

export default function ProfileSection({
  title,
  icon: Icon,
  iconClassName = 'text-brand',
  actions,
  children,
  className = '',
  bodyClassName = 'p-5 sm:p-6',
}: Props) {
  return (
    <section className={`${dashPanel} overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-brand/10 px-5 py-4 sm:px-6 dark:border-white/10">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className={`h-4 w-4 shrink-0 ${iconClassName}`} />
          <h2 className="truncate text-base font-bold text-foreground">{title}</h2>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
