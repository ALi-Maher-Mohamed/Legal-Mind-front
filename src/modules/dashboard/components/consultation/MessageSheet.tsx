'use client';

import { Scale, Volume2, VolumeX } from 'lucide-react';
import type { Citation, ConsultMessage } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';
import CitationChips from './CitationChips';
import CitationDetail from './CitationDetail';
import SpeechControls from './SpeechControls';

type Props = {
  message: ConsultMessage;
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

export default function MessageSheet({
  message,
  speakingMsgId,
  speechRate,
  activeCitation,
  onSpeak,
  onRateChange,
  onStopSpeak,
  onToggleCitation,
  onCloseCitation,
  onOpenViewer,
}: Props) {
  const isUser = message.role === 'user';
  const speaking = speakingMsgId === message.id;
  const showDetail =
    !!activeCitation && !isUser && message.citations?.some((x) => x.id === activeCitation.id);

  return (
    <div className={`flex max-w-full flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`${dashPanel} relative w-full max-w-3xl border-s-4 p-5 sm:p-6 ${
          isUser ? 'border-s-accent' : 'border-s-brand'
        }`}
      >
        <div className="mb-4 flex items-center justify-between border-b border-brand/10 pb-2.5 text-[10px] uppercase text-muted dark:border-white/10">
          <div className="flex items-center gap-1.5">
            {!isUser && <Scale className="h-3.5 w-3.5 text-brand" />}
            <span className="font-bold text-foreground">{isUser ? c.userLabel : c.aiLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSpeak(message.id, message.text)}
              title={speaking ? c.stopReading : c.readAloud}
              className={`rounded p-1 cursor-pointer ${speaking ? 'bg-brand/10 text-brand' : 'text-muted hover:text-foreground'}`}
            >
              {speaking ? <VolumeX className="h-3.5 w-3.5 animate-pulse" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
            <span>{message.timestamp}</span>
          </div>
        </div>

        <div className="whitespace-pre-line text-xs leading-relaxed text-foreground sm:text-sm">
          {message.text}
          {!isUser && (
            <CitationChips
              citations={message.citations ?? []}
              activeId={activeCitation?.id ?? null}
              onToggle={(cit) =>
                activeCitation?.id === cit.id ? onCloseCitation() : onToggleCitation(cit)
              }
            />
          )}
        </div>

        {speaking && (
          <SpeechControls speechRate={speechRate} onRateChange={onRateChange} onStop={onStopSpeak} />
        )}
        {showDetail && activeCitation && (
          <CitationDetail
            citation={activeCitation}
            onClose={onCloseCitation}
            onOpenViewer={() => onOpenViewer(activeCitation)}
          />
        )}
      </div>
    </div>
  );
}
