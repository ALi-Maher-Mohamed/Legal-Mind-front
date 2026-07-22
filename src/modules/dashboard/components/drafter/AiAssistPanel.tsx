'use client';

import { Sparkles } from 'lucide-react';
import { drafterCopy as c } from '../../data/drafterCopy';
import { APPROVED_CLAUSES } from '../../data/drafterClauses.data';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  onInsert: (title: string, text: string) => void;
  onRewrite: () => void;
};

export default function AiAssistPanel({ onInsert, onRewrite }: Props) {
  return (
    <aside className={`${dashPanel} flex h-full flex-col justify-between overflow-hidden p-4`}>
      <div className="flex-1 space-y-4 overflow-y-auto pe-1">
        <div className="mb-1 flex items-center gap-1.5 border-b border-brand/10 pb-2 dark:border-white/10">
          <Sparkles className="h-4 w-4 text-accent" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{c.counselLibrary}</h4>
        </div>
        <p className="text-[10px] italic leading-relaxed text-muted">{c.insertHint}</p>
        <div className="space-y-3.5">
          {APPROVED_CLAUSES.map((clause) => (
            <div
              key={clause.title}
              className="group relative rounded-xl border border-brand/15 bg-[#f8faff] p-3 dark:border-white/10 dark:bg-white/5"
            >
              <span className="block text-[9px] font-bold uppercase text-muted">
                {c.clauseType} {clause.type}
              </span>
              <h5 className="mt-0.5 text-xs font-bold uppercase text-foreground">{clause.title}</h5>
              <p className="mt-1 line-clamp-3 text-[10px] italic text-muted">&ldquo;{clause.text}&rdquo;</p>
              <button
                type="button"
                onClick={() => onInsert(clause.title, clause.text)}
                className="mt-2.5 text-[9px] font-bold uppercase text-brand opacity-0 transition group-hover:opacity-100 hover:opacity-80 cursor-pointer"
              >
                {c.insertBottom}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 border-t border-brand/10 pt-3 dark:border-white/10">
        <button
          type="button"
          onClick={onRewrite}
          className="w-full rounded-lg border border-brand/10 bg-[#f0f4ff] py-2 text-[10px] font-bold uppercase tracking-wider text-brand hover:bg-brand/10 dark:border-white/10 dark:bg-white/5 cursor-pointer"
        >
          {c.rewriteCta}
        </button>
      </div>
    </aside>
  );
}
