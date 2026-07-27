'use client';

import { Sparkles, X } from 'lucide-react';
import type { ClauseAnalysis } from '@/types/analysis.types';
import { analysisCopy as c } from '../../../data/analysisCopy';

type Props = {
  clause?: ClauseAnalysis;
  onClose: () => void;
  onInspect: (tab: 'risks' | 'clauses') => void;
};

export default function HighlightTooltip({ clause, onClose, onInspect }: Props) {
  if (!clause) return null;

  const risky =
    clause.risk_assessment.category === 'high' ||
    clause.risk_assessment.category === 'critical';

  return (
    <div className="absolute inset-x-4 bottom-4 rounded-xl border border-brand/20 bg-white p-4 shadow-xl dark:border-white/15 dark:bg-card sm:inset-x-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-2 end-2 text-muted hover:text-foreground cursor-pointer"
        aria-label="إغلاق"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        {c.highlightLabel}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted">{clause.compliance.explanation}</p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => onInspect(risky ? 'risks' : 'clauses')}
          className="text-[10px] font-bold uppercase tracking-wider text-brand hover:opacity-80 cursor-pointer"
        >
          {c.inspectPanel}
        </button>
      </div>
    </div>
  );
}
