'use client';

import { AlertTriangle, ShieldAlert } from 'lucide-react';
import type { GenerateValidationResult } from '@/types/generate.types';
import { drafterCopy as c } from '../../data/drafterCopy';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  validation: GenerateValidationResult | null;
  isValidating?: boolean;
  canValidate?: boolean;
  onValidate?: () => void;
};

function severityClasses(severity: string) {
  const value = severity.toLowerCase();
  if (value === 'critical' || value === 'high') {
    return {
      box: 'border-danger/30 bg-danger/5',
      badge: 'text-danger',
    };
  }
  if (value === 'medium' || value === 'warning') {
    return {
      box: 'border-accent/40 bg-accent/5',
      badge: 'text-accent',
    };
  }
  return {
    box: 'border-brand/20 bg-brand/5',
    badge: 'text-brand',
  };
}

export default function RiskScannerPanel({
  validation,
  isValidating = false,
  canValidate = false,
  onValidate,
}: Props) {
  const issues = validation?.issues ?? [];

  return (
    <aside className={`${dashPanel} flex h-full flex-col justify-between overflow-hidden p-4`}>
      <div className="flex-1 space-y-4 overflow-y-auto pe-1">
        <div className="mb-1 flex items-center gap-1.5 border-b border-brand/10 pb-2 dark:border-white/10">
          <ShieldAlert className="h-4 w-4 text-danger" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {c.riskTitle}
          </h4>
        </div>

        {validation ? (
          <div className="rounded-xl border border-brand/15 bg-[#f8faff] px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <p className="text-[10px] font-bold uppercase text-muted">{c.scoreLabel}</p>
            <p className="mt-0.5 text-lg font-bold text-foreground">
              {validation.score}
              <span className="text-xs font-semibold text-muted">/100</span>
            </p>
            <p className="mt-1 text-[10px] text-muted">
              {validation.compliantClauses}/{validation.totalClauses} بنود ممتثلة
            </p>
          </div>
        ) : (
          <p className="text-[10px] italic leading-relaxed text-muted">{c.noIssues}</p>
        )}

        <p className="text-[10px] italic leading-relaxed text-muted">{c.riskHint}</p>

        <div className="space-y-4">
          {issues.length === 0 && validation ? (
            <p className="text-[11px] text-success">{c.noIssues}</p>
          ) : null}

          {issues.map((issue, index) => {
            const tone = severityClasses(issue.severity);
            return (
              <div key={`${issue.status}-${index}`} className={`rounded-xl border p-3 ${tone.box}`}>
                <div
                  className={`mb-1 flex items-center gap-1 text-[9px] font-bold uppercase ${tone.badge}`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.5} />
                  {issue.severity} · {issue.status}
                </div>
                <h5 className="line-clamp-2 text-xs font-bold text-foreground">
                  {issue.clause || 'بند'}
                </h5>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">{issue.explanation}</p>
                {issue.suggestedFix ? (
                  <p className="mt-2 text-[10px] leading-relaxed text-foreground/80">
                    <span className="font-bold">{c.suggestedFix}: </span>
                    {issue.suggestedFix}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 space-y-2 border-t border-brand/10 pt-3 dark:border-white/10">
        {canValidate && onValidate ? (
          <button
            type="button"
            onClick={onValidate}
            disabled={isValidating}
            className="w-full rounded-lg border border-brand/15 bg-[#f0f4ff] py-2 text-[10px] font-bold uppercase tracking-wider text-brand transition hover:bg-brand/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 cursor-pointer"
          >
            {isValidating ? c.validating : c.validateCta}
          </button>
        ) : null}
        <p className="text-center text-[10px] leading-relaxed text-muted">{c.riskFooter}</p>
      </div>
    </aside>
  );
}
