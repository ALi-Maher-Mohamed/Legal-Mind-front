'use client';

import { useEffect, useState } from 'react';
import type { AnalysisDocument, AuditTab } from '@/types/analysis.types';
import { analysisCopy as c } from '../../../data/analysisCopy';
import { dashPanel } from '../../../lib/panelStyles';
import HighlightTooltip from './HighlightTooltip';
import DocumentBody, { type HighlightPoint } from './DocumentBody';

type Props = {
  doc: AnalysisDocument;
  highlightId: string | null;
  onHighlight: (id: string | null) => void;
  onInspectTab: (tab: AuditTab) => void;
};

export default function DocumentViewer({ doc, highlightId, onHighlight, onInspectTab }: Props) {
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const clause = doc.result?.clauses.find((item) => item.clause_id === highlightId);

  useEffect(() => {
    if (!highlightId) setAnchor(null);
  }, [highlightId]);

  const handleHighlight = (point: HighlightPoint) => {
    setAnchor({ x: point.x, y: point.y });
    onHighlight(point.id);
  };

  return (
    <div className={`${dashPanel} flex h-[min(70vh,520px)] flex-col overflow-hidden lg:h-full lg:min-h-[560px]`}>
      <div className="flex shrink-0 items-center justify-between border-b border-brand/10 bg-surface-raised px-4 py-3 text-xs dark:border-white/10 dark:bg-white/5 sm:px-5">
        <span className="font-bold text-foreground">{c.viewerTitle}</span>
        <span className="font-mono text-[10px] text-muted">{c.watermark}</span>
      </div>

      <div className="relative flex-1 space-y-4 overflow-y-auto p-4 text-sm leading-relaxed text-foreground sm:p-6">
        <h3 className="mb-4 border-b border-brand/10 pb-3 text-center font-bold uppercase text-foreground dark:border-white/10">
          {doc.name}
        </h3>
        <DocumentBody doc={doc} onHighlight={handleHighlight} />
      </div>

      {highlightId && anchor ? (
        <HighlightTooltip
          clause={clause}
          x={anchor.x}
          y={anchor.y}
          onClose={() => onHighlight(null)}
          onInspect={(tab) => {
            onInspectTab(tab);
            onHighlight(null);
          }}
        />
      ) : null}
    </div>
  );
}
