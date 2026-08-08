'use client';

import { Eye, Radio, Sparkles, Trash2 } from 'lucide-react';
import type { AnalysisDocument } from '@/types/analysis.types';
import { analysisCopy as c } from '../../data/analysisCopy';

type Props = {
  doc: AnalysisDocument;
  analyzing: boolean;
  onOpen: () => void;
  onAudit: () => void;
  onDelete: () => void;
  onWatchStream: () => void;
};

function statusMeta(doc: AnalysisDocument) {
  switch (doc.status) {
    case 'completed':
      return { label: c.statusCompleted, className: 'bg-success/10 text-success' };
    case 'processing':
      return { label: c.statusProcessing, className: 'bg-brand/10 text-brand' };
    case 'failed':
      return { label: c.statusFailed, className: 'bg-danger/10 text-danger' };
    default:
      return { label: c.statusQueued, className: 'bg-accent/15 text-accent' };
  }
}

export default function DocumentListRow({
  doc,
  analyzing,
  onOpen,
  onAudit,
  onDelete,
  onWatchStream,
}: Props) {
  const status = statusMeta(doc);
  const typeLabel = c.typeLabels[doc.type] ?? doc.type;
  const busy = analyzing || doc.status === 'processing';

  return (
    <tr
      className={`border-b border-brand/10 transition hover:bg-surface-raised/60 dark:border-white/10 dark:hover:bg-white/5 ${
        doc.status === 'processing' ? 'cursor-pointer' : ''
      }`}
      onClick={() => {
        if (doc.status === 'processing') onWatchStream();
      }}
    >
      <td className="px-3 py-3.5 sm:px-4">
        <div className="max-w-[16rem]">
          <p className="truncate font-bold text-foreground">{doc.name}</p>
          {doc.status === 'processing' ? (
            <div className="mt-1.5 space-y-1">
              <p className="line-clamp-1 text-[10px] text-brand">
                {doc.currentStage || c.analyzing}
                {typeof doc.progress === 'number' ? ` • ${doc.progress}%` : ''}
              </p>
              <div className="h-1 max-w-[10rem] overflow-hidden rounded-full bg-brand/10 dark:bg-white/10">
                <div
                  className="relative h-full overflow-hidden rounded-full bg-brand transition-all"
                  style={{ width: `${Math.max(doc.progress ?? 8, 8)}%` }}
                >
                  <span className="lm-shimmer absolute inset-0 opacity-70" />
                </div>
              </div>
            </div>
          ) : null}
          {doc.status === 'failed' && doc.error ? (
            <p className="mt-1 line-clamp-2 text-[10px] text-danger">{doc.error}</p>
          ) : null}
        </div>
      </td>
      <td className="hidden px-4 py-3.5 text-muted md:table-cell">{typeLabel}</td>
      <td className="hidden px-4 py-3.5 font-mono text-[10px] text-muted sm:table-cell">{doc.size}</td>
      <td className="hidden px-4 py-3.5 text-muted lg:table-cell">{doc.dateUploaded}</td>
      <td className="px-3 py-3.5 sm:px-4">
        <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${status.className}`}>
          {status.label}
        </span>
      </td>
      <td className="px-3 py-3.5 sm:px-4" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-2">
          {doc.status === 'completed' ? (
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-[10px] font-bold text-on-brand transition hover:opacity-90 cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              {c.openAudit}
            </button>
          ) : null}

          {doc.status === 'queued' ? (
            <button
              type="button"
              onClick={onAudit}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-lg border border-brand px-3 py-1.5 text-[10px] font-bold text-brand transition hover:bg-brand hover:text-on-brand disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {analyzing ? c.analyzing : c.runAudit}
            </button>
          ) : null}

          {doc.status === 'processing' ? (
            <button
              type="button"
              onClick={onWatchStream}
              className="inline-flex items-center gap-1 rounded-lg border border-brand bg-brand/5 px-3 py-1.5 text-[10px] font-bold text-brand transition hover:bg-brand hover:text-on-brand cursor-pointer"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              {c.watchStream}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-1.5 text-muted transition hover:bg-danger/10 hover:text-danger cursor-pointer"
            aria-label={c.deleteTitle}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
