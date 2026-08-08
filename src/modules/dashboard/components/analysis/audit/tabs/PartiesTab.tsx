'use client';

import type { AnalysisDocument } from '@/types/analysis.types';
import { analysisCopy as c } from '../../../../data/analysisCopy';

type Props = { doc: AnalysisDocument };

const PARTY_LABEL = {
  employer: c.partyEmployer,
  employee: c.partyEmployee,
  neutral: c.partyNeutral,
} as const;

const PARTY_BADGE = {
  employer: 'bg-accent/15 text-accent',
  employee: 'bg-brand/10 text-brand',
  neutral: 'bg-success/10 text-success',
} as const;

export default function PartiesTab({ doc }: Props) {
  const clauses = doc.result?.clauses ?? [];

  return (
    <div className="space-y-4">
      <h4 className="border-b border-brand/10 pb-2 text-lg font-bold text-foreground dark:border-white/10">
        {c.partiesTitle} ({clauses.length})
      </h4>

      {clauses.length === 0 ? (
        <p className="py-12 text-center text-xs italic text-muted">{c.noParties}</p>
      ) : (
        <div className="space-y-3">
          {clauses.map((cl) => (
            <div
              key={cl.clause_id}
              className="rounded-xl border border-brand/15 bg-surface-raised p-4 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] text-muted">{cl.clause_id}</span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${PARTY_BADGE[cl.party_balance.favored_party]}`}
                >
                  {c.favoredParty}: {PARTY_LABEL[cl.party_balance.favored_party]}
                </span>
                <span className="text-[10px] text-muted">
                  {c.balanceScore}: {cl.party_balance.score}/100
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-foreground">{cl.clause_text}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {cl.party_balance.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
