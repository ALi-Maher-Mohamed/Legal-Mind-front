'use client';

import {
  Archive,
  ChevronDown,
  History,
  MessageSquarePlus,
  Plus,
  Trash2,
} from 'lucide-react';
import type { Conversation, ConversationFilter } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';
import { ConversationListSkeleton } from './ConsultShimmer';
import ConsultEmptyState from './ConsultEmptyState';

type Props = {
  conversations: Conversation[];
  activeId: string;
  filter: ConversationFilter;
  isCreating?: boolean;
  isLoadingMore?: boolean;
  isListLoading?: boolean;
  hasMoreList?: boolean;
  onFilterChange: (filter: ConversationFilter) => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onLoadMore?: () => void;
  className?: string;
};

export default function ConversationsSidebar({
  conversations,
  activeId,
  filter,
  isCreating = false,
  isLoadingMore = false,
  isListLoading = false,
  hasMoreList = false,
  onFilterChange,
  onSelect,
  onNew,
  onLoadMore,
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

      <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl border border-brand/10 bg-[#f8faff] p-1 dark:border-white/10 dark:bg-white/5">
        <button
          type="button"
          onClick={() => onFilterChange('active')}
          className={`rounded-lg px-2 py-1.5 text-[11px] font-bold transition cursor-pointer ${
            filter === 'active'
              ? 'bg-brand text-on-brand'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {c.activeTab}
        </button>
        <button
          type="button"
          onClick={() => onFilterChange('archived')}
          className={`rounded-lg px-2 py-1.5 text-[11px] font-bold transition cursor-pointer ${
            filter === 'archived'
              ? 'bg-brand text-on-brand'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {c.archivedTab}
        </button>
      </div>

      <button
        type="button"
        onClick={onNew}
        disabled={isCreating}
        className="mb-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-on-brand hover:opacity-90 disabled:opacity-60 cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        {isCreating ? c.creating : c.newSession}
      </button>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pe-1">
        {isListLoading ? (
          <ConversationListSkeleton rows={7} />
        ) : conversations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand/20 bg-[#f8faff]/90 dark:border-white/10 dark:bg-white/[0.03]">
            <ConsultEmptyState
              icon={filter === 'archived' ? Archive : MessageSquarePlus}
              size="sm"
              title={filter === 'archived' ? c.emptyArchivedTitle : c.emptyActiveTitle}
              description={
                filter === 'archived' ? c.emptyArchivedHint : c.emptyActiveHint
              }
              action={
                filter === 'active'
                  ? { label: c.newSession, onClick: onNew }
                  : undefined
              }
            />
          </div>
        ) : (
          conversations.map((conv) => {
            const count = conv.messageCount ?? conv.messages.length;
            const isActive = conv.id === activeId;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv.id)}
                className={`w-full rounded-xl border p-3 text-start transition cursor-pointer ${
                  isActive
                    ? 'border-brand bg-brand/5 shadow-[0_2px_8px_rgba(0,62,199,0.08)]'
                    : 'border-brand/15 bg-[#f8faff] hover:border-brand dark:border-white/10 dark:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquarePlus
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                      isActive ? 'text-brand' : 'text-muted'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="truncate text-xs font-bold text-foreground">{conv.title}</h5>
                    <span className="mt-0.5 flex flex-wrap items-center gap-1 text-[10px] text-muted">
                      <span>
                        {count} {c.dispatches}
                      </span>
                      {conv.status === 'archived' && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-brand/10 px-1.5 py-0.5 text-brand">
                          <Archive className="h-2.5 w-2.5" />
                          {c.statusArchived}
                        </span>
                      )}
                    </span>
                    {conv.lastMessageAt ? (
                      <span className="mt-0.5 block text-[10px] text-muted/80">
                        {new Date(conv.lastMessageAt).toLocaleString('ar-EG', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })
        )}

        {hasMoreList && !isListLoading ? (
          <>
            {isLoadingMore ? <ConversationListSkeleton rows={2} /> : null}
            <button
              type="button"
              disabled={isLoadingMore}
              onClick={onLoadMore}
              className="flex w-full items-center justify-center gap-1 rounded-lg border border-brand/15 py-2 text-[11px] font-bold text-brand hover:bg-brand/5 disabled:opacity-60 cursor-pointer dark:border-white/10"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 ${isLoadingMore ? 'animate-pulse' : ''}`}
              />
              {isLoadingMore ? c.loadingOlder : 'المزيد من الجلسات'}
            </button>
          </>
        ) : null}
      </div>

      {filter === 'archived' ? (
        <p className="mt-2 flex items-start gap-1.5 border-t border-brand/10 pt-2 text-[10px] leading-relaxed text-muted dark:border-white/10">
          <Trash2 className="mt-0.5 h-3 w-3 shrink-0" />
          يمكن استعادة الجلسات أو حذفها نهائياً من شريط الأدوات.
        </p>
      ) : null}
    </aside>
  );
}
