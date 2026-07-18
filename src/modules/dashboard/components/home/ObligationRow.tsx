import { AlertTriangle } from 'lucide-react';
import type { DeskObligation } from '@/types/dashboard.types';

type Props = {
  obligation: DeskObligation;
  dayLabel: string;
};

export default function ObligationRow({ obligation, dayLabel }: Props) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-12 shrink-0 rounded-md border border-brand/20 bg-[#f0f4ff] p-1.5 text-center text-[11px] font-bold text-brand dark:border-accent/30 dark:bg-white/5 dark:text-accent">
        {dayLabel}
      </div>
      <div>
        <h3 className="flex items-center gap-1 text-xs font-bold uppercase tracking-tight text-foreground">
          {obligation.title}
          {obligation.level === 'high' && (
            <AlertTriangle className="inline h-3.5 w-3.5 text-danger" />
          )}
        </h3>
        <p className="mt-0.5 text-[10px] text-muted">{obligation.desc}</p>
      </div>
    </div>
  );
}
