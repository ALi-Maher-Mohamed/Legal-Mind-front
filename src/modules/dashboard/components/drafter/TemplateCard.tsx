'use client';

import { BookOpen } from 'lucide-react';
import type { ContractTemplate } from '@/types/drafter.types';
import { drafterCopy as c } from '../../data/drafterCopy';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  template: ContractTemplate;
  onSelect: (tmpl: ContractTemplate) => void;
};

export default function TemplateCard({ template, onSelect }: Props) {
  return (
    <div className={`${dashPanel} flex h-full flex-col justify-between transition hover:border-brand`}>
      <div className="flex-1 p-4 sm:p-5">
        <div className="relative mb-3 flex h-28 flex-col justify-between overflow-hidden rounded-xl border border-brand/15 bg-surface-raised p-3 dark:border-white/10 dark:bg-white/5 sm:mb-4 sm:h-36 sm:p-4 md:h-40">
          <div className="absolute inset-y-0 start-0 w-1.5 bg-accent" />
          <span className="text-[9px] font-bold uppercase text-muted">
            {c.binder} {template.category}
          </span>
          <BookOpen className="mx-auto h-8 w-8 text-brand" strokeWidth={1.2} />
          <p className="truncate text-center text-xs font-bold uppercase text-foreground">
            {template.name}
          </p>
        </div>
        <h4 className="text-base font-bold uppercase tracking-tight text-foreground">{template.name}</h4>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{template.description}</p>
      </div>
      <div className="border-t border-brand/10 bg-surface-raised/50 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
        <button
          type="button"
          onClick={() => onSelect(template)}
          className="w-full rounded-lg border border-brand py-2.5 text-xs font-bold uppercase tracking-wider text-brand transition hover:bg-brand hover:text-on-brand sm:py-2 cursor-pointer"
        >
          {c.retrieve}
        </button>
      </div>
    </div>
  );
}
