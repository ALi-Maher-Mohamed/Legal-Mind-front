'use client';

import type { AnalysisDocument, RiskLevel } from '@/types/analysis.types';
import { analysisCopy as c } from '../../../../data/analysisCopy';

const LEVEL_UI: Record<RiskLevel, { box: string; badge: string; label: string }> = {
  high: {
    box: 'border-danger/30 bg-danger/5',
    badge: 'bg-danger/15 text-danger',
    label: c.riskHigh,
  },
  medium: {
    box: 'border-accent/40 bg-accent/5',
    badge: 'bg-accent/15 text-accent',
    label: c.riskMedium,
  },
  low: {
    box: 'border-success/30 bg-success/5',
    badge: 'bg-success/15 text-success',
    label: c.riskLow,
  },
};

type Props = { doc: AnalysisDocument };

export default function RisksTab({ doc }: Props) {
  const risks = doc.risks ?? [];

  return (
    <div className="space-y-4">
      <h4 className="border-b border-brand/10 pb-2 text-lg font-bold text-foreground dark:border-white/10">
        {c.risksTitle}
      </h4>

      {risks.length === 0 ? (
        <p className="py-12 text-center text-xs italic text-muted">{c.noRisks}</p>
      ) : (
        <div className="space-y-4">
          {risks.map((rk) => {
            const ui = LEVEL_UI[rk.level];
            return (
              <div key={rk.id} className={`rounded-xl border p-4 shadow-sm ${ui.box}`}>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${ui.badge}`}>
                  {ui.label}
                </span>
                <h5 className="mt-2 text-xs font-bold text-foreground">{rk.description}</h5>
                <p className="mt-2 border-s-2 border-brand ps-2 text-xs italic leading-relaxed text-muted">
                  <span className="mb-1 block font-mono text-[10px] font-bold uppercase not-italic text-foreground">
                    {c.amendment}
                  </span>
                  &ldquo;{rk.suggestion}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
