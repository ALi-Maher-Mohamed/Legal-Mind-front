'use client';

import type { AuditTab, AnalysisDocument } from '@/types/analysis.types';
import { dashPanel } from '../../../lib/panelStyles';
import AnalysisTabs from './AnalysisTabs';
import SummaryTab from './tabs/SummaryTab';
import ClausesTab from './tabs/ClausesTab';
import RisksTab from './tabs/RisksTab';
import TimelineTab from './tabs/TimelineTab';
import PartiesTab from './tabs/PartiesTab';

type Props = {
  doc: AnalysisDocument;
  activeTab: AuditTab;
  onTabChange: (tab: AuditTab) => void;
};

export default function AnalysisPanel({ doc, activeTab, onTabChange }: Props) {
  return (
    <div className={`${dashPanel} flex h-[min(70vh,520px)] flex-col overflow-hidden lg:h-full lg:min-h-[560px]`}>
      <AnalysisTabs active={activeTab} onChange={onTabChange} />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {activeTab === 'summary' && <SummaryTab doc={doc} />}
        {activeTab === 'clauses' && <ClausesTab doc={doc} />}
        {activeTab === 'risks' && <RisksTab doc={doc} />}
        {activeTab === 'timeline' && <TimelineTab doc={doc} />}
        {activeTab === 'parties' && <PartiesTab doc={doc} />}
      </div>
    </div>
  );
}
