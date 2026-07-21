'use client';

import { Eye, FileText, Sparkles } from 'lucide-react';
import type { GazetteDocument } from '@/types/gazette.types';
import { gazetteCopy as c } from '../../data/gazetteCopy';

type Props = {
  doc: GazetteDocument;
  analyzing: boolean;
  onOpen: () => void;
  onAudit: () => void;
};

export default function DocumentListRow({ doc, analyzing, onOpen, onAudit }: Props) {
  const audited = doc.status === 'Analysis Complete';
  const typeLabel = c.typeLabels[doc.type] ?? doc.type;

  return (
    <tr className="border-b border-brand/10 transition hover:bg-[#f0f4ff]/60 dark:border-white/10 dark:hover:bg-white/5">
      <td className="px-3 py-3.5 sm:px-4">
        <div className="flex max-w-[14rem] items-center gap-2 sm:max-w-xs">
          <FileText className="h-4 w-4 shrink-0 text-brand" />
          <span className="truncate font-bold text-foreground">{doc.name}</span>
        </div>
      </td>
      <td className="hidden px-4 py-3.5 text-muted md:table-cell">{typeLabel}</td>
      <td className="hidden px-4 py-3.5 font-mono text-[10px] text-muted sm:table-cell">{doc.size}</td>
      <td className="hidden px-4 py-3.5 text-muted lg:table-cell">{doc.dateUploaded}</td>
      <td className="px-3 py-3.5 sm:px-4">
        <span
          className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
            audited ? 'bg-success/10 text-success' : 'bg-accent/15 text-accent'
          }`}
        >
          {audited ? c.audited : c.pending}
        </span>
      </td>
      <td className="px-3 py-3.5 sm:px-4">
        <button
          type="button"
          onClick={audited ? onOpen : onAudit}
          disabled={analyzing}
          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-bold transition cursor-pointer disabled:opacity-50 ${
            audited
              ? 'bg-brand text-on-brand hover:opacity-90'
              : 'border border-brand text-brand hover:bg-brand hover:text-on-brand'
          }`}
        >
          {audited ? <Eye className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5 text-accent" />}
          {analyzing ? c.analyzing : audited ? c.openAudit : c.runAudit}
        </button>
      </td>
    </tr>
  );
}
