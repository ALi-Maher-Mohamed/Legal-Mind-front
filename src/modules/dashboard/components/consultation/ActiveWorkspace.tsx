'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { Citation, Conversation } from '@/types/consultation.types';
import ConversationsSidebar from './ConversationsSidebar';
import WorkspaceHeader from './WorkspaceHeader';
import MessageThread from './MessageThread';
import ComposerForm from './ComposerForm';
import CitationsDrawer from './CitationsDrawer';

type Props = {
  conversations: Conversation[];
  conversation: Conversation;
  citations: Citation[];
  inputText: string;
  setInputText: Dispatch<SetStateAction<string>>;
  isSending: boolean;
  toast: 'share' | 'export' | null;
  speakingMsgId: string | null;
  speechRate: number;
  activeCitation: Citation | null;
  showHistory: boolean;
  onShare: () => void;
  onExport: () => void;
  onToggleHistory: () => void;
  onCloseHistory: () => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onSend: () => void;
  onSpeak: (id: string, text: string) => void;
  onRateChange: (rate: number) => void;
  onStopSpeak: () => void;
  onToggleCitation: (cit: Citation) => void;
  onCloseCitation: () => void;
  onOpenViewer: (cit: Citation) => void;
};

export default function ActiveWorkspace(p: Props) {
  const sidebar = (
    <ConversationsSidebar
      conversations={p.conversations}
      activeId={p.conversation.id}
      onSelect={p.onSelectConversation}
      onNew={p.onNewConversation}
    />
  );

  return (
    <div className="relative flex h-full flex-1 gap-4 overflow-hidden md:gap-6">
      <div className="hidden h-full w-64 shrink-0 lg:block xl:w-72">{sidebar}</div>
      {p.showHistory && (
        <div className="absolute inset-0 z-20 flex lg:hidden">
          <div className="relative z-10 h-full w-[min(100%,18rem)]">{sidebar}</div>
          <button type="button" className="flex-1 bg-[#0b1326]/40 cursor-pointer" aria-label="إغلاق السجل" onClick={p.onCloseHistory} />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <WorkspaceHeader conversation={p.conversation} toast={p.toast} onShare={p.onShare} onExport={p.onExport} onOpenHistory={p.onToggleHistory} />
        <MessageThread messages={p.conversation.messages} isSending={p.isSending} speakingMsgId={p.speakingMsgId} speechRate={p.speechRate} activeCitation={p.activeCitation} onSpeak={p.onSpeak} onRateChange={p.onRateChange} onStopSpeak={p.onStopSpeak} onToggleCitation={p.onToggleCitation} onCloseCitation={p.onCloseCitation} onOpenViewer={p.onOpenViewer} />
        <ComposerForm contextType={p.conversation.contextType} value={p.inputText} onChange={p.setInputText} onAppend={(chunk) => p.setInputText((prev) => (prev ? `${prev} ${chunk}` : chunk))} onSend={p.onSend} isSending={p.isSending} />
      </div>
      <CitationsDrawer citations={p.citations} onOpen={p.onOpenViewer} />
    </div>
  );
}
