'use client';

import type { AnalysisDocument, RiskCategory } from '@/types/analysis.types';
import { analysisCopy as c } from '../../../../data/analysisCopy';

const LEVEL_UI: Record<RiskCategory, { box: string; badge: string; label: string }> = {
  critical: {
    box: 'border-danger/40 bg-danger/10',
    badge: 'bg-danger/20 text-danger',
    label: c.riskCritical,
  },
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
  const clauseRisks = (doc.result?.clauses ?? [])
    .filter((cl) => cl.risk_assessment.category === 'high' || cl.risk_assessment.category === 'critical')
    .map((cl) => ({
      id: cl.clause_id,
      category: cl.risk_assessment.category,
      description: cl.risk_assessment.description || cl.compliance.explanation,
      suggestion: cl.required_action.suggested_fix,
    }));

  const fallbackRisks =
    clauseRisks.length === 0
      ? (doc.result?.overall.top_risks ?? []).map((text, index) => ({
          id: `top-${index}`,
          category: 'high' as const,
          description: text,
          suggestion: '',
        }))
      : [];

  const risks = clauseRisks.length > 0 ? clauseRisks : fallbackRisks;

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
            const ui = LEVEL_UI[rk.category];
            return (
              <div key={rk.id} className={`rounded-xl border p-4 shadow-sm ${ui.box}`}>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${ui.badge}`}>
                  {ui.label}
                </span>
                <h5 className="mt-2 text-xs font-bold leading-relaxed text-foreground">
                  {rk.description}
                </h5>
                {rk.suggestion && rk.suggestion !== 'No suggestion provided' ? (
                  <p className="mt-2 border-s-2 border-brand ps-2 text-xs italic leading-relaxed text-muted">
                    <span className="mb-1 block font-mono text-[10px] font-bold uppercase not-italic text-foreground">
                      {c.amendment}
                    </span>
                    {rk.suggestion}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
