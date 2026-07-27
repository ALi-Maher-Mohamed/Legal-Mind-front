'use client';

import { ChevronLeft, Folder, Trash2 } from 'lucide-react';
import type { AnalysisDocument } from '@/types/analysis.types';
import { analysisCopy as c } from '../../data/analysisCopy';
import { dashPanel } from '../../lib/panelStyles';

const ACCENTS = ['border-t-brand', 'border-t-accent', 'border-t-brand-deep', 'border-t-success'];

type Props = {
  doc: AnalysisDocument;
  index: number;
  analyzing: boolean;
  onOpen: () => void;
  onAudit: () => void;
  onDelete: () => void;
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

export default function DocumentFolderCard({
  doc,
  index,
  analyzing,
  onOpen,
  onAudit,
  onDelete,
}: Props) {
  const status = statusMeta(doc);
  const typeLabel = c.typeLabels[doc.type] ?? doc.type;
  const busy = analyzing || doc.status === 'processing';

  const actionLabel =
    doc.status === 'completed'
      ? c.viewAudit
      : doc.status === 'failed'
        ? c.retryUpload
        : busy
          ? c.analyzing
          : c.runAudit;

  const canPrimary =
    doc.status === 'queued' || doc.status === 'completed' || doc.status === 'failed';

  return (
    <div
      className={`${dashPanel} flex flex-col justify-between border-t-4 p-5 ${ACCENTS[index % ACCENTS.length]} ${
        doc.status === 'queued' || doc.status === 'failed' ? 'bg-[#f8faff] dark:bg-white/[0.03]' : ''
      }`}
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-2">
          <Folder className="h-8 w-8 text-brand" strokeWidth={1.2} />
          <div className="flex items-center gap-1">
            <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${status.className}`}>
              {status.label}
            </span>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md p-1 text-muted transition hover:bg-danger/10 hover:text-danger cursor-pointer"
              aria-label={c.deleteTitle}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <h4 className="truncate text-sm font-bold text-foreground">{doc.name}</h4>
        <p className="mt-1 text-[10px] text-muted">
          {c.category}: {typeLabel} • {doc.size}
        </p>

        {doc.status === 'processing' ? (
          <div className="mt-3 space-y-1.5">
            <p className="line-clamp-2 text-[11px] text-brand">
              {doc.currentStage || c.analyzing}
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-brand/10 dark:bg-white/10">
              <div
                className="h-full bg-brand transition-all duration-500"
                style={{ width: `${doc.progress ?? 5}%` }}
              />
            </div>
            {doc.currentStep ? (
              <p className="text-[10px] text-muted">
                {doc.currentStep} {c.progressOf}
              </p>
            ) : null}
          </div>
        ) : null}

        {doc.status === 'failed' && doc.error ? (
          <p className="mt-3 line-clamp-3 text-[11px] leading-relaxed text-danger">{doc.error}</p>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-brand/10 pt-3 text-[11px] dark:border-white/10">
        <span className="italic text-muted">{doc.dateUploaded}</span>
        <button
          type="button"
          onClick={() => {
            if (doc.status === 'completed') onOpen();
            else if (doc.status === 'queued') onAudit();
          }}
          disabled={!canPrimary || (doc.status === 'queued' && busy) || doc.status === 'failed'}
          className="inline-flex items-center gap-0.5 font-bold text-brand hover:opacity-80 disabled:cursor-not-allowed disabled:text-muted cursor-pointer"
        >
          {actionLabel}
          {doc.status !== 'failed' ? <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
        </button>
      </div>
    </div>
  );
}
