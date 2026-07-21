'use client';

import type { AnalysisDocument } from '@/types/analysis.types';
import DocumentFolderCard from './DocumentFolderCard';

type Props = {
  documents: AnalysisDocument[];
  analyzingId: string | null;
  onOpen: (doc: AnalysisDocument) => void;
  onAudit: (id: string) => void;
};

export default function DocumentGrid({ documents, analyzingId, onOpen, onAudit }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((doc, index) => (
        <DocumentFolderCard
          key={doc.id}
          doc={doc}
          index={index}
          analyzing={analyzingId === doc.id}
          onOpen={() => onOpen(doc)}
          onAudit={() => onAudit(doc.id)}
        />
      ))}
    </div>
  );
}
