'use client';

import { useState } from 'react';
import type { AuditTab, AnalysisDocument } from '@/types/analysis.types';
import AuditHeader from './AuditHeader';
import DocumentViewer from './DocumentViewer';
import AnalysisPanel from './AnalysisPanel';

type Props = {
  doc: AnalysisDocument;
  highlightId: string | null;
  onHighlight: (id: string | null) => void;
  onBack: () => void;
};

export default function AuditView({ doc, highlightId, onHighlight, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<AuditTab>('summary');

  return (
    <div className="space-y-6">
      <AuditHeader doc={doc} onBack={onBack} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 lg:items-stretch">
        <div className="lg:col-span-6">
          <DocumentViewer
            doc={doc}
            highlightId={highlightId}
            onHighlight={onHighlight}
            onInspectTab={setActiveTab}
          />
        </div>
        <div className="lg:col-span-6">
          <AnalysisPanel doc={doc} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
