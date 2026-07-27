'use client';

import type { LucideIcon } from 'lucide-react';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  title: string;
  icon: LucideIcon;
  iconClassName?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
};

export default function ProfileSection({
  title,
  icon: Icon,
  iconClassName = 'text-brand',
  children,
  className = '',
  bodyClassName = 'p-5 sm:p-6',
}: Props) {
  return (
    <section className={`${dashPanel} overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 border-b border-brand/10 px-5 py-4 sm:px-6 dark:border-white/10">
        <Icon className={`h-4 w-4 ${iconClassName}`} />
        <h2 className="text-base font-bold text-foreground">{title}</h2>
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
