'use client';

import {
  Archive,
  ArchiveRestore,
  Download,
  History,
  PencilLine,
  Share2,
  Trash2,
} from 'lucide-react';
import type { Conversation } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  conversation: Conversation;
  toast: 'share' | 'export' | null;
  isMutating?: boolean;
  onShare: () => void;
  onExport: () => void;
  onOpenHistory: () => void;
  onRename: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
};

const iconBtn =
  'rounded-lg border border-brand/15 bg-surface-raised p-2 text-muted transition hover:text-foreground disabled:opacity-50 dark:border-white/10 dark:bg-white/5 cursor-pointer';

export default function WorkspaceHeader({
  conversation,
  toast,
  isMutating = false,
  onShare,
  onExport,
  onOpenHistory,
  onRename,
  onArchive,
  onUnarchive,
  onDelete,
}: Props) {
  const archived = conversation.status === 'archived';

  return (
    <div
      className={`${dashPanel} relative flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              archived ? 'bg-muted' : 'bg-accent'
            }`}
          />
          <h3 className="truncate text-sm font-bold text-foreground sm:text-base">
            {conversation.title}
          </h3>
          {archived ? (
            <span className="shrink-0 rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
              {c.statusArchived}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-[10px] text-muted">
          EG · {conversation.messageCount ?? conversation.messages.length} {c.dispatches} ·{' '}
          {c.secure}
        </p>
      </div>

      <div className="relative flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
        {toast && (
          <span className="absolute -top-7 end-0 rounded bg-brand px-2 py-0.5 text-[10px] text-on-brand">
            {toast === 'share' ? c.shareOk : c.exportOk}
          </span>
        )}

        <button type="button" onClick={onRename} disabled={isMutating} title={c.rename} className={iconBtn}>
          <PencilLine className="h-3.5 w-3.5" />
        </button>

        {archived ? (
          <button
            type="button"
            onClick={onUnarchive}
            disabled={isMutating}
            title={c.unarchive}
            className={iconBtn}
          >
            <ArchiveRestore className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onArchive}
            disabled={isMutating}
            title={c.archive}
            className={iconBtn}
          >
            <Archive className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          disabled={isMutating}
          title={c.delete}
          className={`${iconBtn} hover:border-danger/30 hover:text-danger`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <button type="button" onClick={onShare} title={c.shareTitle} className={iconBtn}>
          <Share2 className="h-3.5 w-3.5" />
        </button>
        <button type="button" onClick={onExport} title={c.exportTitle} className={iconBtn}>
          <Download className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          title={c.priorLogs}
          className={`${iconBtn} lg:hidden`}
        >
          <History className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
