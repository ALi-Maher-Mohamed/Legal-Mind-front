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
    <div className={`${dashPanel} flex flex-col justify-between transition hover:border-brand`}>
      <div className="flex-1 p-5">
        <div className="relative mb-4 flex h-36 flex-col justify-between overflow-hidden rounded-xl border border-brand/15 bg-[#f0f4ff] p-4 dark:border-white/10 dark:bg-white/5 sm:h-40">
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
      <div className="border-t border-brand/10 bg-[#f8faff]/50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <button
          type="button"
          onClick={() => onSelect(template)}
          className="w-full rounded-lg border border-brand py-2 text-xs font-bold uppercase tracking-wider text-brand transition hover:bg-brand hover:text-on-brand cursor-pointer"
        >
          {c.retrieve}
        </button>
      </div>
    </div>
  );
}
