'use client';

import { Eye, X } from 'lucide-react';
import type { Citation } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';

type Props = {
  citation: Citation;
  onClose: () => void;
  onOpenViewer: () => void;
};

export default function CitationDetail({ citation, onClose, onOpenViewer }: Props) {
  return (
    <div className="relative mt-3 rounded-xl border border-accent/40 bg-[#f8faff] p-3.5 text-xs text-muted dark:bg-white/5">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-2 end-2 text-muted hover:text-foreground cursor-pointer"
        aria-label="إغلاق"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="font-bold uppercase text-foreground">
        {citation.sourceName}
        {citation.page ? ` • ${c.page} ${citation.page}` : ''}
      </div>
      <p className="mt-1 border-s-2 border-brand ps-2 text-xs italic leading-relaxed">
        &ldquo;{citation.excerpt}&rdquo;
      </p>
      <button
        type="button"
        onClick={onOpenViewer}
        className="mt-2 inline-flex items-center gap-0.5 text-[10px] font-bold uppercase text-brand hover:opacity-80 cursor-pointer"
      >
        <Eye className="h-3.5 w-3.5" /> {c.openViewer}
      </button>
    </div>
  );
}
