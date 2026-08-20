'use client';

import { AlertTriangle } from 'lucide-react';
import type { AnalysisDocument } from '@/types/analysis.types';
import { analysisCopy as c } from '../../../../data/analysisCopy';

type Props = { doc: AnalysisDocument };

const SCORE_COLORS: Record<string, string> = {
  green: 'bg-success/15 text-success',
  yellow: 'bg-accent/15 text-accent',
  orange: 'bg-accent/20 text-accent',
  red: 'bg-danger/15 text-danger',
};

function classificationFromScore(score: number): keyof typeof c.classificationLabels {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'needs_review';
  if (score >= 30) return 'high_risk';
  return 'critical';
}

function resolveResultLabel(overall: NonNullable<AnalysisDocument['result']>['overall']) {
  const key =
    overall.classification in c.classificationLabels
      ? overall.classification
      : classificationFromScore(overall.overall_score);
  return c.classificationLabels[key] ?? overall.classification;
}

export default function SummaryTab({ doc }: Props) {
  const overall = doc.result?.overall;

  if (!overall) {
    return <p className="py-12 text-center text-xs italic text-muted">{c.summaryFallback}</p>;
  }

  const breakdown = [
    { key: 'compliance', value: overall.breakdown.compliance },
    { key: 'risk', value: overall.breakdown.risk },
    { key: 'completeness', value: overall.breakdown.completeness },
    { key: 'balance', value: overall.breakdown.balance },
  ];

  const resultLabel = resolveResultLabel(overall);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={`rounded-xl px-4 py-3 text-center ${SCORE_COLORS[overall.color] ?? SCORE_COLORS.orange}`}
        >
          <p className="text-[10px] font-bold uppercase">{c.scoreLabel}</p>
          <p className="text-2xl font-bold">{resultLabel}</p>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2 text-center text-[10px]">
          <div className="rounded-lg bg-surface-raised p-2 dark:bg-white/5">
            <p className="font-bold text-success">{overall.mandatory_clauses.present}</p>
            <p className="text-muted">{c.mandatoryPresent}</p>
          </div>
          <div className="rounded-lg bg-surface-raised p-2 dark:bg-white/5">
            <p className="font-bold text-accent">{overall.mandatory_clauses.missing}</p>
            <p className="text-muted">{c.mandatoryMissing}</p>
          </div>
          <div className="rounded-lg bg-surface-raised p-2 dark:bg-white/5">
            <p className="font-bold text-danger">{overall.mandatory_clauses.non_compliant}</p>
            <p className="text-muted">{c.mandatoryNonCompliant}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="border-b border-brand/10 pb-2 text-lg font-bold text-foreground dark:border-white/10">
          {c.summaryTitle}
        </h4>
        <p className="mt-3 rounded-lg border-s-2 border-accent bg-surface-raised/80 py-3 ps-4 text-sm leading-relaxed text-muted dark:bg-white/5">
          {overall.summary}
        </p>
      </div>

      <div>
        <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand">
          {c.breakdownTitle}
        </h5>
        <div className="space-y-2">
          {breakdown.map((item) => (
            <div key={item.key} className="flex items-center gap-3 text-xs">
              <span className="w-24 shrink-0 capitalize text-muted">{item.key}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand/10 dark:bg-white/10">
                <div
                  className="h-full bg-brand"
                  style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
                />
              </div>
              <span className="w-8 text-end font-bold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {overall.top_risks.length > 0 ? (
        <div>
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand">
            {c.topRisksTitle}
          </h5>
          <ul className="space-y-2.5">
            {overall.top_risks.slice(0, 3).map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" strokeWidth={2.5} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
