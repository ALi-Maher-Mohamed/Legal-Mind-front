'use client';

import type { Citation } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';

type Props = {
  citations: Citation[];
  activeId: string | null;
  onToggle: (cit: Citation) => void;
};

export default function CitationChips({ citations, activeId, onToggle }: Props) {
  if (citations.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-brand/10 pt-3 dark:border-white/10">
      <span className="self-center text-[10px] font-bold uppercase text-muted">{c.references}</span>
      {citations.map((cit, idx) => (
        <button
          key={cit.id}
          type="button"
          onClick={() => onToggle(cit)}
          className={`rounded-lg border px-2 py-0.5 text-[10px] italic transition cursor-pointer ${
            activeId === cit.id
              ? 'border-accent bg-accent/10 text-brand'
              : 'border-brand/15 bg-[#f0f4ff] text-brand hover:border-accent dark:border-white/10 dark:bg-white/5'
          }`}
        >
          [{idx + 1}] {cit.sourceName}
        </button>
      ))}
    </div>
  );
}
