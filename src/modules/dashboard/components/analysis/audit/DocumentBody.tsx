'use client';

import type { AnalysisDocument, ComplianceStatus } from '@/types/analysis.types';
import { analysisCopy as c } from '../../../data/analysisCopy';

const mark =
  'cursor-pointer rounded-sm border-b-2 px-1 py-0.5 font-medium transition';

const BORDER: Record<ComplianceStatus, string> = {
  compliant: 'border-success bg-success/15 hover:bg-success/25',
  non_compliant: 'border-danger bg-danger/15 hover:bg-danger/25',
  partially_compliant: 'border-accent bg-accent/15 hover:bg-accent/25',
  missing: 'border-muted bg-muted/15 hover:bg-muted/25',
};

export type HighlightPoint = {
  id: string;
  x: number;
  y: number;
};

type Props = {
  doc: AnalysisDocument;
  onHighlight: (point: HighlightPoint) => void;
};

export default function DocumentBody({ doc, onHighlight }: Props) {
  const clauses = doc.result?.clauses ?? [];

  if (clauses.length === 0) {
    return <p className="text-sm italic text-muted">{c.noClauses}</p>;
  }

  return (
    <>
      {clauses.map((cl, index) => (
        <div key={cl.clause_id} className="mb-5">
          <h4 className="text-xs font-bold uppercase text-brand">
            البند {index + 1}: {cl.clause_id}
          </h4>
          <p className="mt-2">
            <span
              onClick={(event) => {
                onHighlight({
                  id: cl.clause_id,
                  x: event.clientX,
                  y: event.clientY,
                });
              }}
              className={`${mark} ${BORDER[cl.compliance.status]}`}
            >
              {cl.clause_text}
            </span>
          </p>
        </div>
      ))}
    </>
  );
}
