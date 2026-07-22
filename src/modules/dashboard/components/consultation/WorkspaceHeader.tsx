'use client';

import { Download, History, Share2 } from 'lucide-react';
import type { Conversation } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  conversation: Conversation;
  toast: 'share' | 'export' | null;
  onShare: () => void;
  onExport: () => void;
  onOpenHistory: () => void;
};

export default function WorkspaceHeader({
  conversation,
  toast,
  onShare,
  onExport,
  onOpenHistory,
}: Props) {
  return (
    <div className={`${dashPanel} relative flex shrink-0 items-center justify-between gap-3 px-4 py-3.5 sm:px-5`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              conversation.contextType === 'kb' ? 'bg-brand' : 'bg-accent'
            }`}
          />
          <h3 className="truncate text-sm font-bold text-foreground sm:text-base">
            {conversation.title}
          </h3>
        </div>
        <p className="mt-0.5 font-mono text-[10px] uppercase text-muted">
          {c.indexMode}: {conversation.contextType.toUpperCase()} • {c.secure}
        </p>
      </div>

      <div className="relative flex shrink-0 items-center gap-2 sm:gap-3">
        {toast && (
          <span className="absolute -top-7 end-0 rounded bg-brand px-2 py-0.5 text-[10px] text-on-brand">
            {toast === 'share' ? c.shareOk : c.exportOk}
          </span>
        )}
        <button
          type="button"
          onClick={onShare}
          title={c.shareTitle}
          className="rounded-lg border border-brand/15 bg-[#f0f4ff] p-2 text-muted hover:text-foreground dark:border-white/10 dark:bg-white/5 cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onExport}
          title={c.exportTitle}
          className="rounded-lg border border-brand/15 bg-[#f0f4ff] p-2 text-muted hover:text-foreground dark:border-white/10 dark:bg-white/5 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onOpenHistory}
          title={c.priorLogs}
          className="inline-flex items-center gap-1 rounded-lg border border-brand/15 bg-[#f0f4ff] p-2 text-muted hover:text-foreground dark:border-white/10 dark:bg-white/5 cursor-pointer lg:hidden"
        >
          <History className="h-3.5 w-3.5" />
          <span className="hidden text-[10px] font-bold uppercase sm:inline">{c.priorLogs}</span>
        </button>
      </div>
    </div>
  );
}
