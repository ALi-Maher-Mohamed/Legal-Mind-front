'use client';

import { Mic, Paperclip, Send } from 'lucide-react';
import type { ContextType } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import { useDictation } from '../../hooks/useDictation';

type Props = {
  contextType: ContextType;
  value: string;
  onChange: (v: string) => void;
  onAppend: (chunk: string) => void;
  onSend: () => void;
  isSending: boolean;
};

export default function ComposerForm({
  contextType,
  value,
  onChange,
  onAppend,
  onSend,
  isSending,
}: Props) {
  const { isDictating, toggleDictation } = useDictation(onAppend);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="shrink-0 border-t border-brand/10 pt-2 dark:border-white/10"
    >
      <div className="rounded-2xl border border-brand/15 bg-white p-2 dark:border-white/10 dark:bg-card">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={c.placeholder}
          rows={3}
          className="w-full resize-none bg-transparent px-2 py-1 text-xs leading-relaxed text-foreground placeholder:italic placeholder:text-muted focus:outline-none sm:text-sm"
        />
        <div className="flex items-center justify-between gap-2 border-t border-brand/10 px-2 pt-2 dark:border-white/10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(c.attachAlert)}
              className="rounded-lg p-1.5 text-muted hover:text-foreground cursor-pointer"
              aria-label="مرفق"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleDictation}
              title={isDictating ? c.stopDictation : c.startDictation}
              className={`rounded-lg p-1.5 transition cursor-pointer ${
                isDictating
                  ? 'animate-pulse bg-brand text-on-brand'
                  : 'text-muted hover:bg-[#f0f4ff] hover:text-foreground dark:hover:bg-white/5'
              }`}
            >
              <Mic className="h-4 w-4" />
            </button>
            <span className="rounded border border-brand/10 bg-[#f0f4ff] px-2 py-0.5 text-[10px] font-bold uppercase text-brand dark:border-white/10 dark:bg-white/5">
              {contextType.toUpperCase()} {c.mode}
            </span>
            {isDictating && (
              <span className="hidden text-[9px] font-bold text-brand animate-pulse sm:inline">
                {c.dictating}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!value.trim() || isSending}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand px-4 py-1.5 text-xs font-bold uppercase text-on-brand transition hover:opacity-90 disabled:bg-brand/30 cursor-pointer"
          >
            {c.send} <Send className="h-3 w-3" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </form>
  );
}
