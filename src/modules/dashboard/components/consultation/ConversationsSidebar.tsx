'use client';

import { History, MessageSquarePlus, Plus } from 'lucide-react';
import type { Conversation } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  className?: string;
};

export default function ConversationsSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  className = '',
}: Props) {
  return (
    <aside
      className={`${dashPanel} flex h-full w-full flex-col overflow-hidden p-3 sm:p-4 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between border-b border-brand/10 pb-3 dark:border-white/10">
        <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
          <History className="h-4 w-4 text-brand" />
          {c.historyTitle}
        </h4>
        <span className="rounded bg-[#f0f4ff] px-2 py-0.5 text-[9px] font-bold dark:bg-white/5">
          {conversations.length}
        </span>
      </div>

      <button
        type="button"
        onClick={onNew}
        className="mb-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-on-brand hover:opacity-90 cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        {c.newTitles.general}
      </button>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pe-1">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            type="button"
            onClick={() => onSelect(conv.id)}
            className={`w-full rounded-xl border p-3 text-start transition cursor-pointer ${
              conv.id === activeId
                ? 'border-brand bg-brand/5'
                : 'border-brand/15 bg-[#f8faff] hover:border-brand dark:border-white/10 dark:bg-white/5'
            }`}
          >
            <div className="flex items-start gap-2">
              <MessageSquarePlus
                className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                  conv.id === activeId ? 'text-brand' : 'text-muted'
                }`}
              />
              <div className="min-w-0">
                <h5 className="truncate text-xs font-bold text-foreground">{conv.title}</h5>
                <span className="mt-0.5 block text-[10px] uppercase text-muted">
                  {c.contexts[conv.contextType].title} • {conv.messages.length} {c.dispatches}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
