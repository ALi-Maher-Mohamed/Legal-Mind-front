'use client';

import { ChevronLeft, Folder } from 'lucide-react';
import type { GazetteDocument } from '@/types/gazette.types';
import { gazetteCopy as c } from '../../data/gazetteCopy';
import { dashPanel } from '../../lib/panelStyles';

const ACCENTS = ['border-t-brand', 'border-t-accent', 'border-t-brand-deep', 'border-t-success'];

type Props = {
  doc: GazetteDocument;
  index: number;
  analyzing: boolean;
  onOpen: () => void;
  onAudit: () => void;
};

export default function DocumentFolderCard({ doc, index, analyzing, onOpen, onAudit }: Props) {
  const audited = doc.status === 'Analysis Complete';
  const typeLabel = c.typeLabels[doc.type] ?? doc.type;

  return (
    <div
      className={`${dashPanel} flex flex-col justify-between border-t-4 p-5 ${ACCENTS[index % ACCENTS.length]} ${
        audited ? '' : 'bg-[#f8faff] dark:bg-white/[0.03]'
      }`}
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-2">
          <Folder className="h-8 w-8 text-brand" strokeWidth={1.2} />
          <span
            className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
              audited ? 'bg-success/10 text-success' : 'bg-accent/15 text-accent'
            }`}
          >
            {audited ? c.audited : c.pending}
          </span>
        </div>
        <h4 className="truncate text-sm font-bold text-foreground">{doc.name}</h4>
        <p className="mt-1 text-[10px] text-muted">
          {c.category}: {typeLabel} • {doc.size}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {doc.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-brand/10 bg-[#f0f4ff] px-1.5 py-0.5 text-[9px] italic text-muted dark:border-white/10 dark:bg-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-brand/10 pt-3 text-[11px] dark:border-white/10">
        <span className="italic text-muted">{doc.dateUploaded}</span>
        <button
          type="button"
          onClick={audited ? onOpen : onAudit}
          disabled={analyzing}
          className="inline-flex items-center gap-0.5 font-bold text-brand hover:opacity-80 disabled:text-muted cursor-pointer"
        >
          {analyzing ? c.analyzing : audited ? c.viewAudit : c.runAudit}
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
