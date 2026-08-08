'use client';

import { useEffect, useRef } from 'react';
import { ChevronUp, Scale, Sparkles } from 'lucide-react';
import type { Citation, ConsultMessage } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';
import MessageSheet from './MessageSheet';

type Props = {
  messages: ConsultMessage[];
  isSending: boolean;
  isLoadingMessages?: boolean;
  isLoadingOlder?: boolean;
  hasMoreMessages?: boolean;
  title?: string;
  speakingMsgId: string | null;
  speechRate: number;
  activeCitation: Citation | null;
  onLoadOlder?: () => void;
  onSpeak: (id: string, text: string) => void;
  onRateChange: (rate: number) => void;
  onStopSpeak: () => void;
  onToggleCitation: (cit: Citation) => void;
  onCloseCitation: () => void;
  onOpenViewer: (cit: Citation) => void;
};

export default function MessageThread(props: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(0);

  useEffect(() => {
    // Only auto-scroll when messages grow at the end (new send), not when prepending older.
    if (props.messages.length > prevCount.current) {
      const grewAtEnd =
        props.isSending ||
        props.messages.length - prevCount.current <= 2;
      if (grewAtEnd) {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    prevCount.current = props.messages.length;
  }, [props.messages, props.isSending]);

  if (props.isLoadingMessages && props.messages.length === 0) {
    return (
      <div className="my-4 flex flex-1 items-center justify-center text-sm text-muted">
        {c.loading}
      </div>
    );
  }

  return (
    <div className="my-4 flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pe-1">
        {props.hasMoreMessages ? (
          <div className="flex justify-center">
            <button
              type="button"
              disabled={props.isLoadingOlder}
              onClick={props.onLoadOlder}
              className="inline-flex items-center gap-1 rounded-full border border-brand/15 bg-white px-3 py-1.5 text-[11px] font-bold text-brand shadow-sm hover:bg-brand/5 disabled:opacity-60 cursor-pointer dark:border-white/10 dark:bg-card"
            >
              <ChevronUp className="h-3.5 w-3.5" />
              {props.isLoadingOlder ? c.loadingOlder : c.loadOlder}
            </button>
          </div>
        ) : null}

        {props.messages.length === 0 && !props.isSending ? (
          <div
            className={`${dashPanel} mx-auto max-w-lg border-s-4 border-s-brand p-6 text-center sm:p-8`}
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <Scale className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">{c.emptyChatTitle}</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
              {c.emptyChatHint}
            </p>
            {props.title ? (
              <p className="mt-3 text-[11px] font-medium text-brand">{props.title}</p>
            ) : null}
          </div>
        ) : (
          props.messages.map((msg) => (
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
          ))
        )}

        {props.isSending && (
          <div
            className={`${dashPanel} flex max-w-xl items-center gap-3 border-s-4 border-s-accent p-5 text-xs italic text-muted`}
          >
            <Sparkles className="h-4 w-4 shrink-0 animate-spin text-accent" />
            {c.typing}
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
