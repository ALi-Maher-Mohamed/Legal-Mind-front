'use client';

import { useEffect, useRef } from 'react';
import {
  Check,
  Circle,
  Loader2,
  Radio,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';
import type { AnalysisDocument } from '@/types/analysis.types';
import { analysisCopy as c } from '../../data/analysisCopy';
import { useAnalysisStream } from '../../hooks/useAnalysisStream';

type Props = {
  open: boolean;
  doc: AnalysisDocument | null;
  onClose: () => void;
};

function StepIcon({ state }: { state: 'pending' | 'active' | 'done' | 'error' }) {
  if (state === 'done') {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success/15 text-success">
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    );
  }
  if (state === 'error') {
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-danger/15 text-danger">
        <XCircle className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (state === 'active') {
    return (
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-brand/15 text-brand">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/5 text-muted">
      <Circle className="h-3 w-3" />
    </span>
  );
}

export default function AnalysisStreamModal({ open, doc, onClose }: Props) {
  const stream = useAnalysisStream(doc, open);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [stream.logs.length, stream.liveMessage]);

  if (!open || !doc) return null;

  const live =
    !stream.done && !stream.failed && (doc.status === 'processing' || stream.connecting);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={c.streamTitle}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0b1326]/70 backdrop-blur-sm cursor-pointer"
        aria-label={c.streamClose}
        onClick={onClose}
      />

      <div className="relative flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1326] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-brand via-[#4f7dff] to-accent" />

        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="min-w-0 text-start">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                <Radio className={`h-3 w-3 ${live ? 'animate-pulse' : ''}`} />
                {stream.failed
                  ? c.streamFailed
                  : stream.done
                    ? c.streamDone
                    : c.streamLive}
              </span>
              <span className="font-mono text-[10px] text-[#9aa3b5]">
                {stream.currentStep || '—'} • {stream.progress}%
              </span>
            </div>
            <h3 className="truncate text-base font-bold text-white sm:text-lg">{doc.name}</h3>
            <p className="mt-0.5 text-xs text-[#c4c6cf]">{c.streamSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#c4c6cf] transition hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label={c.streamClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-white/10 px-4 py-3 sm:px-6">
          <div className="mb-2 flex items-center justify-between gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-[#c4c6cf]">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="line-clamp-1">{stream.liveMessage || c.analyzing}</span>
            </span>
            <span className="shrink-0 font-bold text-white">{stream.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`relative h-full rounded-full transition-all duration-500 ${
                stream.failed ? 'bg-danger' : stream.done ? 'bg-success' : 'bg-brand'
              }`}
              style={{ width: `${Math.max(stream.progress, 4)}%` }}
            >
              {live ? <span className="lm-shimmer absolute inset-0 opacity-60" /> : null}
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden md:grid-cols-2">
          <div className="overflow-y-auto border-b border-white/10 p-4 sm:p-5 md:border-b-0 md:border-e">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#9aa3b5]">
              {c.streamStages}
            </p>
            <ol className="space-y-3">
              {stream.steps.map((item) => (
                <li key={item.step} className="flex items-start gap-3">
                  <StepIcon state={item.state} />
                  <div className="min-w-0 pt-0.5">
                    <p
                      className={`text-xs font-semibold ${
                        item.state === 'active'
                          ? 'text-white'
                          : item.state === 'done'
                            ? 'text-[#d7dce8]'
                            : item.state === 'error'
                              ? 'text-danger'
                              : 'text-[#7f8798]'
                      }`}
                    >
                      {item.step} — {item.label}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex min-h-[220px] flex-col overflow-hidden p-4 sm:p-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#9aa3b5]">
              {c.streamFeed}
            </p>
            <div className="flex-1 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-black/25 p-3 font-mono text-[11px] leading-relaxed">
              {stream.logs.length === 0 ? (
                <p className="text-[#7f8798]">{c.streamWaiting}</p>
              ) : (
                stream.logs.map((log, index) => (
                  <div
                    key={`${log.timestamp}-${log.step}-${index}`}
                    className={`rounded-lg px-2.5 py-2 ${
                      log.step === 'error'
                        ? 'bg-danger/10 text-[#ffb4b4]'
                        : index === 0
                          ? 'bg-brand/15 text-[#dce6ff]'
                          : 'text-[#a8b0c2]'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2 text-[10px] opacity-70">
                      <span>{log.step}</span>
                      <span>
                        {new Date(log.timestamp).toLocaleTimeString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap break-words">{log.message}</p>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
