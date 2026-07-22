'use client';

import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import type { Citation, ConsultMessage } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';
import MessageSheet from './MessageSheet';

type Props = {
  messages: ConsultMessage[];
  isSending: boolean;
  speakingMsgId: string | null;
  speechRate: number;
  activeCitation: Citation | null;
  onSpeak: (id: string, text: string) => void;
  onRateChange: (rate: number) => void;
  onStopSpeak: () => void;
  onToggleCitation: (cit: Citation) => void;
  onCloseCitation: () => void;
  onOpenViewer: (cit: Citation) => void;
};

export default function MessageThread(props: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [props.messages, props.isSending]);

  return (
    <div className="my-4 flex-1 space-y-6 overflow-y-auto pe-1">
      {props.messages.map((msg) => (
        <MessageSheet
          key={msg.id}
          message={msg}
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
      ))}

      {props.isSending && (
        <div className={`${dashPanel} flex max-w-xl items-center gap-3 border-s-4 border-s-accent p-5 text-xs italic text-muted`}>
          <Sparkles className="h-4 w-4 shrink-0 animate-spin text-accent" />
          {c.typing}
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
