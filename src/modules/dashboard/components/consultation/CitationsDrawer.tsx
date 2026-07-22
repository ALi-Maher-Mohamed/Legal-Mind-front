'use client';

import { BookOpen, Eye } from 'lucide-react';
import type { Citation } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  citations: Citation[];
  onOpen: (cit: Citation) => void;
};

export default function CitationsDrawer({ citations, onOpen }: Props) {
  return (
    <aside
      className={`${dashPanel} relative hidden h-full w-72 shrink-0 flex-col justify-between p-4 lg:flex`}
    >
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-brand/10 pb-3 dark:border-white/10">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
            <BookOpen className="h-4 w-4 text-brand" /> {c.citationsTitle}
          </h4>
          <span className="rounded bg-[#f0f4ff] px-2 py-0.5 text-[9px] font-bold dark:bg-white/5">
            {citations.length} {c.items}
          </span>
        </div>

        {citations.length === 0 ? (
          <p className="py-12 text-center text-xs italic text-muted">{c.noCitations}</p>
        ) : (
          <div className="max-h-[450px] space-y-3 overflow-y-auto pe-1">
            {citations.map((cit, idx) => (
              <button
                key={cit.id}
                type="button"
                onClick={() => onOpen(cit)}
                className="group relative w-full rounded-xl border border-brand/15 bg-[#f8faff] p-3 text-start transition hover:border-accent dark:border-white/10 dark:bg-white/5 cursor-pointer"
              >
                <Eye className="absolute top-2 end-2 h-3.5 w-3.5 text-brand opacity-0 transition group-hover:opacity-100" />
                <span className="text-[10px] font-bold text-muted">
                  {c.source} [0{idx + 1}]
                </span>
                <h5 className="mt-0.5 truncate text-xs font-bold uppercase text-foreground">
                  {cit.sourceName}
                </h5>
                <p className="mt-1 line-clamp-2 text-[10px] italic text-muted">
                  &ldquo;{cit.excerpt}&rdquo;
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="border-t border-brand/10 pt-4 text-center text-[9px] leading-relaxed text-muted dark:border-white/10">
        {c.grounding}
      </p>
    </aside>
  );
}
