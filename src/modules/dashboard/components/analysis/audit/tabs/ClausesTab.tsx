'use client';

import type { AnalysisDocument, ComplianceStatus } from '@/types/analysis.types';
import { analysisCopy as c } from '../../../../data/analysisCopy';

type Props = { doc: AnalysisDocument };

const COMPLIANCE_UI: Record<ComplianceStatus, string> = {
  compliant: 'bg-success/10 text-success',
  non_compliant: 'bg-danger/10 text-danger',
  partially_compliant: 'bg-accent/15 text-accent',
  missing: 'bg-muted/20 text-muted',
};

const COMPLIANCE_LABEL: Record<ComplianceStatus, string> = {
  compliant: c.complianceCompliant,
  non_compliant: c.complianceNonCompliant,
  partially_compliant: c.compliancePartial,
  missing: c.complianceMissing,
};

export default function ClausesTab({ doc }: Props) {
  const clauses = doc.result?.clauses ?? [];

  return (
    <div className="space-y-4">
      <h4 className="border-b border-brand/10 pb-2 text-lg font-bold text-foreground dark:border-white/10">
        {c.clausesTitle} ({clauses.length})
      </h4>

      {clauses.length === 0 ? (
        <p className="py-12 text-center text-xs italic text-muted">{c.noClauses}</p>
      ) : (
        <div className="space-y-4">
          {clauses.map((cl) => (
            <div
              key={cl.clause_id}
              className="rounded-xl border border-brand/15 bg-surface-raised p-4 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] text-muted">{cl.clause_id}</span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${COMPLIANCE_UI[cl.compliance.status]}`}
                >
                  {COMPLIANCE_LABEL[cl.compliance.status]}
                </span>
                <span className="text-[10px] text-muted">
                  {c.confidence} {cl.compliance.confidence}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-foreground">{cl.clause_text}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">{cl.compliance.explanation}</p>

              {cl.legal_basis[0] ? (
                <p className="mt-2 text-[11px] text-brand">
                  {c.legalBasis}: {cl.legal_basis[0].law} — {cl.legal_basis[0].article}
                </p>
              ) : null}

              {cl.required_action.action_needed ? (
                <p className="mt-3 border-s-2 border-accent ps-2 text-xs italic leading-relaxed text-muted">
                  <span className="mb-1 block font-mono text-[10px] font-bold uppercase not-italic text-foreground">
                    {c.amendment}
                  </span>
                  {cl.required_action.suggested_fix}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
