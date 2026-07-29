'use client';

import { FileText, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import type { GenerateJobListItem } from '@/types/generate.types';
import { drafterCopy as c } from '../../data/drafterCopy';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  jobs: GenerateJobListItem[];
  isLoading: boolean;
  deletingId: string | null;
  onRefresh: () => void;
  onOpen: (job: GenerateJobListItem) => void;
  onDelete: (job: GenerateJobListItem) => void;
};

function statusLabel(status: string) {
  const value = status.toLowerCase();
  if (value === 'completed') return c.statusCompleted;
  if (value === 'processing') return c.statusProcessing;
  if (value === 'queued' || value === 'pending') return c.statusQueued;
  if (value === 'failed') return c.statusFailed;
  if (value === 'cancelled' || value === 'canceled') return c.statusCancelled;
  return status;
}

function statusTone(status: string) {
  const value = status.toLowerCase();
  if (value === 'completed') return 'text-success';
  if (value === 'failed') return 'text-danger';
  if (value === 'cancelled' || value === 'canceled') return 'text-muted';
  return 'text-brand';
}

function jobTitle(job: GenerateJobListItem) {
  const desc = job.result?.contractSpec?.job_description?.trim();
  if (desc) return `عقد عمل — ${desc}`;
  if (job.contractType === 'employment') return 'عقد عمل';
  if (job.contractType) return `عقد ${job.contractType}`;
  if (job.prompt?.trim()) return job.prompt.trim().slice(0, 64);
  return `${c.customDraft}${c.draftSuffix}`;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function GenerationJobsPanel({
  jobs,
  isLoading,
  deletingId,
  onRefresh,
  onOpen,
  onDelete,
}: Props) {
  return (
    <section className={`${dashPanel} p-5 sm:p-6`}>
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-brand/10 pb-3 dark:border-white/10">
        <h3 className="text-lg font-bold uppercase text-foreground">{c.jobsTitle}</h3>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand/15 bg-[#f0f4ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand hover:bg-brand/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {c.jobsRefresh}
        </button>
      </div>

      {isLoading && jobs.length === 0 ? (
        <p className="text-sm text-muted">{c.jobsLoading}</p>
      ) : jobs.length === 0 ? (
        <p className="text-sm text-muted">{c.jobsEmpty}</p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => {
            const busy = deletingId === job.jobId;
            return (
              <li
                key={job.jobId}
                className="flex flex-col gap-3 rounded-xl border border-brand/15 bg-[#f8faff] p-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5"
              >
                <div className="min-w-0 flex items-start gap-2.5">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{jobTitle(job)}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      <span className={statusTone(String(job.status))}>
                        {statusLabel(String(job.status))}
                      </span>
                      {' · '}
                      {formatDate(job.createdAt || job.completedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpen(job)}
                    disabled={busy}
                    className="rounded-lg bg-brand px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-on-brand hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  >
                    {c.jobsOpen}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(job)}
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-lg border border-danger/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-danger hover:bg-danger/5 disabled:opacity-50 cursor-pointer"
                  >
                    {busy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    {c.jobsDelete}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
