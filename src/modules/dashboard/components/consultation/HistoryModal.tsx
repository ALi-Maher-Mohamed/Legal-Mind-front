'use client';

import { ChevronLeft, History, X } from 'lucide-react';
import type { ContextType, Conversation } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';

type Props = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: (type: ContextType) => void;
  onClose: () => void;
};

export default function HistoryModal({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/50 p-4">
      <div className="relative flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-brand/15 bg-white shadow-2xl dark:border-white/10 dark:bg-card">
        <div className="flex items-center justify-between border-b border-brand/20 bg-brand px-5 py-4 text-on-brand">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
            <History className="h-4 w-4 text-accent" /> {c.historyTitle}
          </h4>
          <button type="button" onClick={onClose} className="opacity-80 hover:opacity-100 cursor-pointer" aria-label="إغلاق">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[50vh] space-y-3 overflow-y-auto p-4">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => {
                onSelect(conv.id);
                onClose();
              }}
              className={`group flex w-full items-center justify-between rounded-xl border p-3.5 text-start transition cursor-pointer ${
                conv.id === activeId
                  ? 'border-brand bg-brand/5 font-semibold'
                  : 'border-brand/15 bg-white hover:border-brand dark:border-white/10 dark:bg-white/5'
              }`}
            >
              <div>
                <h5 className="text-sm uppercase tracking-tight text-foreground">{conv.title}</h5>
                <span className="mt-1 block text-[10px] uppercase text-muted">
                  {conv.contextType.toUpperCase()} {c.mode} • {conv.messages.length} {c.dispatches}
                </span>
              </div>
              <ChevronLeft className="h-4 w-4 text-brand opacity-0 transition group-hover:opacity-100" />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-brand/10 bg-[#f0f4ff] px-5 py-3.5 text-xs dark:border-white/10 dark:bg-white/5">
          <button
            type="button"
            onClick={() => onCreate('general')}
            className="font-bold uppercase tracking-wider text-brand hover:opacity-80 cursor-pointer"
          >
            {c.newSession}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-brand px-4 py-1.5 text-[11px] font-bold uppercase text-on-brand cursor-pointer"
          >
            {c.done}
          </button>
        </div>
      </div>
    </div>
  );
}
