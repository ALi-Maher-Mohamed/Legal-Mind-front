'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { ClauseAnalysis } from '@/types/analysis.types';
import { analysisCopy as c } from '../../../data/analysisCopy';

type Props = {
  clause?: ClauseAnalysis;
  x: number;
  y: number;
  onClose: () => void;
  onInspect: (tab: 'risks' | 'clauses') => void;
};

const OFFSET = 14;
const VIEW_PAD = 12;

export default function HighlightTooltip({ clause, x, y, onClose, onInspect }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x + OFFSET, top: y + OFFSET });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const maxLeft = window.innerWidth - rect.width - VIEW_PAD;
    const maxTop = window.innerHeight - rect.height - VIEW_PAD;

    let left = x + OFFSET;
    let top = y + OFFSET;

    if (left > maxLeft) left = Math.max(VIEW_PAD, x - rect.width - OFFSET);
    if (top > maxTop) top = Math.max(VIEW_PAD, y - rect.height - OFFSET);

    left = Math.min(Math.max(VIEW_PAD, left), Math.max(VIEW_PAD, maxLeft));
    top = Math.min(Math.max(VIEW_PAD, top), Math.max(VIEW_PAD, maxTop));

    setPos({ left, top });
  }, [x, y, clause?.clause_id]);

  if (!clause) return null;

  const risky =
    clause.risk_assessment.category === 'high' ||
    clause.risk_assessment.category === 'critical';

  return (
    <div
      ref={ref}
      role="tooltip"
      className="fixed z-[80] w-[min(20rem,calc(100vw-1.5rem))] rounded-xl border border-brand/20 bg-white p-4 shadow-xl dark:border-white/15 dark:bg-card"
      style={{ left: pos.left, top: pos.top }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-2 end-2 text-muted hover:text-foreground cursor-pointer"
        aria-label="إغلاق"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="mb-1 flex items-center gap-1.5 pe-6 text-xs font-bold text-brand">
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
