'use client';

import { useEffect } from 'react';
import { Download, X, ZoomIn } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

type Props = {
  open: boolean;
  src: string;
  alt: string;
  title?: string;
  onClose: () => void;
};

export default function ProfileImagePreview({ open, src, alt, title, onClose }: Props) {
  const { t } = useLanguage();
  const dialogTitle = title || t.dashboard.profilePreviewTitle;

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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={dialogTitle}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#050a17]/80 backdrop-blur-sm cursor-pointer"
        aria-label={t.dashboard.cancel}
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101a30] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2 text-start">
            <ZoomIn className="h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {dialogTitle}
              </p>
              <p className="truncate text-[11px] text-[#c4c6cf]">{alt}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15"
            >
              <Download className="h-3.5 w-3.5" />
              {t.dashboard.profilePreviewOpen}
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#c4c6cf] transition hover:bg-white/10 hover:text-white cursor-pointer"
              aria-label={t.dashboard.cancel}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex max-h-[78vh] items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(0,62,199,0.18),transparent_60%)] p-3 sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
