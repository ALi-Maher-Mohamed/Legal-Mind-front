'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageSquarePlus, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { consultCopy as c } from '../../data/consultCopy';

type Props = {
  open: boolean;
  isLoading?: boolean;
  onCreate: (title: string) => Promise<boolean> | boolean;
  onClose: () => void;
};

export default function NewConversationModal({
  open,
  isLoading = false,
  onCreate,
  onClose,
}: Props) {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle('');
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, isLoading, onClose]);

  if (!open) return null;

  const trimmed = title.trim();
  const canSubmit = trimmed.length > 0 && !isLoading;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-[#0b1326]/55 backdrop-blur-[2px] cursor-pointer"
        aria-label={c.cancel}
        disabled={isLoading}
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand/15 bg-white shadow-[0_24px_60px_rgba(11,19,38,0.3)] dark:border-white/10 dark:bg-card">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-brand via-[#0038b6] to-accent" />
        <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
            <div className="text-start">
              <h3 className="text-lg font-bold text-foreground">{c.newChatTitle}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{c.newChatHint}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-muted hover:bg-[#f0f4ff] dark:hover:bg-white/5 cursor-pointer"
            aria-label={c.cancel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="space-y-4 px-5 py-5 sm:px-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            void onCreate(trimmed);
          }}
        >
          <label className="block text-start">
            <span className="mb-1.5 block text-[11px] font-bold text-muted">{c.newChatLabel}</span>
            <input
              ref={inputRef}
              type="text"
              value={title}
              maxLength={160}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={c.newChatPlaceholder}
              disabled={isLoading}
              className="w-full rounded-xl border border-brand/15 bg-[#f8faff] px-4 py-3 text-sm text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
              autoComplete="off"
            />
          </label>
          <p className="text-[10px] text-muted">{c.newChatStayHint}</p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" size="md" disabled={isLoading} onClick={onClose}>
              {c.cancel}
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isLoading} disabled={!canSubmit}>
              {c.newChatStart}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
