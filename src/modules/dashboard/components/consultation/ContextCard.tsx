'use client';

import { Book, ChevronLeft, Database, FolderOpen, Scale, type LucideIcon } from 'lucide-react';
import type { ContextType } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';

const ICONS: Record<ContextType, LucideIcon> = {
  general: Book,
  firm: FolderOpen,
  case: Scale,
  kb: Database,
};

type Props = {
  type: ContextType;
  onSelect: (type: ContextType) => void;
};

export default function ContextCard({ type, onSelect }: Props) {
  const Icon = ICONS[type];
  const meta = c.contexts[type];

  return (
    <button
      type="button"
      onClick={() => onSelect(type)}
      className={`${dashPanel} group flex gap-4 p-5 text-start transition hover:border-brand cursor-pointer`}
    >
      <div className="shrink-0 rounded-xl border border-brand/15 bg-[#f0f4ff] p-3 transition group-hover:bg-brand/10 dark:border-white/10 dark:bg-white/5">
        <Icon className="h-6 w-6 text-brand" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">{meta.title}</h4>
        <p className="mt-1 text-xs leading-relaxed text-muted">{meta.desc}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-brand opacity-0 transition group-hover:opacity-100">
          {c.startSession}
          <ChevronLeft className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}
