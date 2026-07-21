'use client';

import type { AuditTab } from '@/types/gazette.types';
import { gazetteCopy as c } from '../../../data/gazetteCopy';

const TABS: { id: AuditTab; label: string }[] = [
  { id: 'summary', label: c.tabSummary },
  { id: 'clauses', label: c.tabClauses },
  { id: 'risks', label: c.tabRisks },
  { id: 'timeline', label: c.tabTimeline },
  { id: 'parties', label: c.tabParties },
];

type Props = {
  active: AuditTab;
  onChange: (tab: AuditTab) => void;
};

export default function AnalysisTabs({ active, onChange }: Props) {
  return (
    <div className="flex shrink-0 overflow-x-auto border-b border-brand/15 bg-[#f0f4ff] dark:border-white/10 dark:bg-white/5">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`shrink-0 border-e border-brand/10 px-4 py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer dark:border-white/10 sm:px-5 ${
            active === tab.id
              ? 'border-b-2 border-b-brand bg-white text-brand dark:bg-card'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
