'use client';

import { useEffect } from 'react';
import { LogIn, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { useLanguage } from '@/hooks/useLanguage';

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function LoginRequiredModal({ open, onConfirm, onCancel }: Props) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-required-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0b1326]/60 backdrop-blur-[2px] cursor-pointer"
        aria-label={t.common.loginRequiredCancel}
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand/15 bg-white shadow-[0_24px_60px_rgba(11,19,38,0.35)] dark:border-white/10 dark:bg-card">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-brand via-[#0038b6] to-accent" />

        <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
              <LogIn className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-start">
              <h3
                id="login-required-title"
                className="text-lg font-bold tracking-tight text-foreground"
              >
                {t.common.loginRequiredTitle}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {t.common.loginRequiredDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-muted transition hover:bg-[#f0f4ff] hover:text-foreground dark:hover:bg-white/5 cursor-pointer"
            aria-label={t.common.loginRequiredCancel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-brand/10 bg-[#f7f9ff] px-5 py-4 sm:flex-row sm:justify-end dark:border-white/10 dark:bg-white/5 sm:px-6">
          <Button type="button" variant="secondary" size="md" onClick={onCancel} className="!rounded-xl">
            {t.common.loginRequiredCancel}
          </Button>
          <Button type="button" variant="primary" size="md" onClick={onConfirm} className="!rounded-xl">
            <span className="inline-flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              {t.common.loginRequiredConfirm}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
