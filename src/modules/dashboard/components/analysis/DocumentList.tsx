'use client';

import type { AnalysisDocument } from '@/types/analysis.types';
import { analysisCopy as c } from '../../data/analysisCopy';
import { dashPanel } from '../../lib/panelStyles';
import DocumentListRow from './DocumentListRow';

type Props = {
  documents: AnalysisDocument[];
  analyzingId: string | null;
  onOpen: (doc: AnalysisDocument) => void;
  onAudit: (id: string) => void;
};

export default function DocumentList({ documents, analyzingId, onOpen, onAudit }: Props) {
  return (
    <div className={`${dashPanel} overflow-x-auto`}>
      <table className="w-full min-w-[36rem] border-collapse text-start text-xs sm:text-sm">
        <thead>
          <tr className="bg-brand text-[10px] font-bold uppercase tracking-wider text-on-brand">
            <th className="px-3 py-3.5 sm:px-4">{c.colName}</th>
            <th className="hidden px-4 py-3.5 md:table-cell">{c.colCategory}</th>
            <th className="hidden px-4 py-3.5 sm:table-cell">{c.colSize}</th>
            <th className="hidden px-4 py-3.5 lg:table-cell">{c.colDate}</th>
            <th className="px-3 py-3.5 sm:px-4">{c.colStatus}</th>
            <th className="px-3 py-3.5 sm:px-4">{c.colActions}</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <DocumentListRow
              key={doc.id}
              doc={doc}
              analyzing={analyzingId === doc.id}
              onOpen={() => onOpen(doc)}
              onAudit={() => onAudit(doc.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
