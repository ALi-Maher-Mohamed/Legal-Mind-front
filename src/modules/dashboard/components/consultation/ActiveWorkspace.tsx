'use client';

import type { Dispatch, SetStateAction } from 'react';
import type { Citation, Conversation } from '@/types/consultation.types';
import WorkspaceHeader from './WorkspaceHeader';
import MessageThread from './MessageThread';
import ComposerForm from './ComposerForm';
import CitationsDrawer from './CitationsDrawer';

type Props = {
  conversation: Conversation;
  citations: Citation[];
  inputText: string;
  setInputText: Dispatch<SetStateAction<string>>;
  isSending: boolean;
  toast: 'share' | 'export' | null;
  speakingMsgId: string | null;
  speechRate: number;
  activeCitation: Citation | null;
  onShare: () => void;
  onExport: () => void;
  onOpenHistory: () => void;
  onSend: () => void;
  onSpeak: (id: string, text: string) => void;
  onRateChange: (rate: number) => void;
  onStopSpeak: () => void;
  onToggleCitation: (cit: Citation) => void;
  onCloseCitation: () => void;
  onOpenViewer: (cit: Citation) => void;
};

export default function ActiveWorkspace(props: Props) {
  return (
    <div className="relative flex h-full flex-1 flex-col gap-4 overflow-hidden md:flex-row md:gap-6">
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <WorkspaceHeader
          conversation={props.conversation}
          toast={props.toast}
          onShare={props.onShare}
          onExport={props.onExport}
          onOpenHistory={props.onOpenHistory}
        />
        <MessageThread
          messages={props.conversation.messages}
          isSending={props.isSending}
          speakingMsgId={props.speakingMsgId}
          speechRate={props.speechRate}
          activeCitation={props.activeCitation}
          onSpeak={props.onSpeak}
          onRateChange={props.onRateChange}
          onStopSpeak={props.onStopSpeak}
          onToggleCitation={props.onToggleCitation}
          onCloseCitation={props.onCloseCitation}
          onOpenViewer={props.onOpenViewer}
        />
        <ComposerForm
          contextType={props.conversation.contextType}
          value={props.inputText}
          onChange={props.setInputText}
          onAppend={(chunk) =>
            props.setInputText((prev) => (prev ? `${prev} ${chunk}` : chunk))
          }
          onSend={props.onSend}
          isSending={props.isSending}
        />
      </div>
      <CitationsDrawer citations={props.citations} onOpen={props.onOpenViewer} />
    </div>
  );
}
