'use client';

import { BookOpen, X } from 'lucide-react';
import type { Citation } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';

type Props = {
  source: Citation;
  onClose: () => void;
};

export default function SourceViewerModal({ source, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/50 p-4">
      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-brand/15 bg-white shadow-2xl dark:border-white/10 dark:bg-card">
        <div className="flex items-center justify-between bg-brand px-5 py-4 text-on-brand sm:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-bold uppercase tracking-wider">{c.viewerTitle}</h4>
          </div>
          <button type="button" onClick={onClose} className="opacity-80 hover:opacity-100 cursor-pointer" aria-label="إغلاق">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto bg-[#f0f4ff] p-4 dark:bg-background sm:p-6">
          <div className="relative min-h-[280px] rounded-xl border border-brand/15 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-card sm:p-8">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-bold uppercase tracking-widest text-brand/5 select-none sm:text-6xl">
              {c.watermark}
            </div>
            <h3 className="mb-6 border-b border-brand/10 pb-3 text-center font-bold uppercase text-foreground dark:border-white/10">
              {source.sourceName}
            </h3>
            <p className="mb-4 text-end text-xs italic text-muted">
              {c.archiveId}: {source.id.toUpperCase()} • {c.page} {source.page || 1}
            </p>
            <p className="border-s-4 border-brand bg-[#f8faff] py-2 ps-4 text-sm italic leading-relaxed dark:bg-white/5">
              &ldquo;{source.excerpt}&rdquo;
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted">{c.viewerNote}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-brand/10 bg-[#f0f4ff] px-5 py-3.5 text-xs dark:border-white/10 dark:bg-white/5 sm:px-6">
          <span className="font-mono text-muted">{c.verified}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-brand px-5 py-1.5 text-xs font-bold uppercase text-on-brand hover:opacity-90 cursor-pointer"
          >
            {c.closeArchive}
          </button>
        </div>
      </div>
    </div>
  );
}
