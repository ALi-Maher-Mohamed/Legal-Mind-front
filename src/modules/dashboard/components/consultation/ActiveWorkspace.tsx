'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Archive } from 'lucide-react';
import type {
  Citation,
  Conversation,
  ConversationFilter,
} from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';
import ConversationsSidebar from './ConversationsSidebar';
import WorkspaceHeader from './WorkspaceHeader';
import MessageThread from './MessageThread';
import ComposerForm from './ComposerForm';
import CitationsDrawer from './CitationsDrawer';

type Props = {
  conversations: Conversation[];
  conversation: Conversation;
  citations: Citation[];
  filter: ConversationFilter;
  inputText: string;
  setInputText: Dispatch<SetStateAction<string>>;
  isSending: boolean;
  isCreating?: boolean;
  isMutating?: boolean;
  isLoadingMessages?: boolean;
  isLoadingOlder?: boolean;
  isLoadingMoreList?: boolean;
  hasMoreList?: boolean;
  toast: 'share' | 'export' | null;
  speakingMsgId: string | null;
  speechRate: number;
  activeCitation: Citation | null;
  showHistory: boolean;
  onFilterChange: (filter: ConversationFilter) => void;
  onShare: () => void;
  onExport: () => void;
  onToggleHistory: () => void;
  onCloseHistory: () => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onLoadMoreList?: () => void;
  onLoadOlder?: () => void;
  onRename: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
  onSend: () => void;
  onSpeak: (id: string, text: string) => void;
  onRateChange: (rate: number) => void;
  onStopSpeak: () => void;
  onToggleCitation: (cit: Citation) => void;
  onCloseCitation: () => void;
  onOpenViewer: (cit: Citation) => void;
};

export default function ActiveWorkspace(p: Props) {
  const archived = p.conversation.status === 'archived';

  const sidebar = (
    <ConversationsSidebar
      conversations={p.conversations}
      activeId={p.conversation.id}
      filter={p.filter}
      onFilterChange={p.onFilterChange}
      onSelect={p.onSelectConversation}
      onNew={p.onNewConversation}
      isCreating={p.isCreating}
      isLoadingMore={p.isLoadingMoreList}
      hasMoreList={p.hasMoreList}
      onLoadMore={p.onLoadMoreList}
    />
  );

  return (
    <div className="relative flex h-full flex-1 gap-4 overflow-hidden md:gap-6">
      <div className="hidden h-full w-64 shrink-0 lg:block xl:w-72">{sidebar}</div>
      {p.showHistory && (
        <div className="absolute inset-0 z-20 flex lg:hidden">
          <div className="relative z-10 h-full w-[min(100%,18rem)]">{sidebar}</div>
          <button
            type="button"
            className="flex-1 bg-[#0b1326]/40 cursor-pointer"
            aria-label="إغلاق السجل"
            onClick={p.onCloseHistory}
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceHeader
          conversation={p.conversation}
          toast={p.toast}
          isMutating={p.isMutating}
          onShare={p.onShare}
          onExport={p.onExport}
          onOpenHistory={p.onToggleHistory}
          onRename={p.onRename}
          onArchive={p.onArchive}
          onUnarchive={p.onUnarchive}
          onDelete={p.onDelete}
        />
        <MessageThread
          messages={p.conversation.messages}
          isSending={p.isSending}
          isLoadingMessages={p.isLoadingMessages}
          isLoadingOlder={p.isLoadingOlder}
          hasMoreMessages={p.conversation.hasMoreMessages}
          title={p.conversation.title}
          speakingMsgId={p.speakingMsgId}
          speechRate={p.speechRate}
          activeCitation={p.activeCitation}
          onLoadOlder={p.onLoadOlder}
          onSpeak={p.onSpeak}
          onRateChange={p.onRateChange}
          onStopSpeak={p.onStopSpeak}
          onToggleCitation={p.onToggleCitation}
          onCloseCitation={p.onCloseCitation}
          onOpenViewer={p.onOpenViewer}
        />
        {!archived ? (
          <ComposerForm
            value={p.inputText}
            onChange={p.setInputText}
            onAppend={(chunk) =>
              p.setInputText((prev) => (prev ? `${prev} ${chunk}` : chunk))
            }
            onSend={p.onSend}
            isSending={p.isSending}
          />
        ) : (
          <div
            className={`${dashPanel} shrink-0 flex items-start gap-3 border-s-4 border-s-muted p-4 dark:border-s-white/20`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/15 bg-surface-raised text-muted dark:border-white/10 dark:bg-white/5">
              <Archive className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1 text-start">
              <p className="text-xs font-bold text-foreground">{c.archivedBannerTitle}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                {c.archivedBannerHint}
              </p>
              <button
                type="button"
                onClick={p.onUnarchive}
                disabled={p.isMutating}
                className="mt-2 text-[11px] font-bold text-brand hover:underline disabled:opacity-50 cursor-pointer"
              >
                {c.unarchive}
              </button>
            </div>
          </div>
        )}
      </div>
      <CitationsDrawer citations={p.citations} onOpen={p.onOpenViewer} />
    </div>
  );
}
