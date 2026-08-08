'use client';

import { useEffect } from 'react';
import { AlertTriangle, LogOut, X, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  isLoading?: boolean;
  tone?: 'danger' | 'brand';
  icon?: LucideIcon;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isLoading = false,
  tone = 'danger',
  icon: Icon = AlertTriangle,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) onCancel();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isLoading, onCancel]);

  if (!open) return null;

  const iconWrap =
    tone === 'danger'
      ? 'border-danger/20 bg-danger/10 text-danger'
      : 'border-brand/20 bg-brand/10 text-brand';

  const confirmClass =
    tone === 'danger'
      ? '!bg-danger !text-white hover:!brightness-110 shadow-[0_8px_20px_rgba(186,26,26,0.25)]'
      : undefined;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#0b1326]/60 backdrop-blur-[2px] cursor-pointer"
        aria-label={cancelLabel}
        disabled={isLoading}
        onClick={() => {
          if (!isLoading) onCancel();
        }}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand/15 bg-white shadow-[0_24px_60px_rgba(11,19,38,0.35)] dark:border-white/10 dark:bg-card">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-brand via-[#0038b6] to-accent" />

        <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconWrap}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 text-start">
              <h3
                id="confirm-modal-title"
                className="text-lg font-bold tracking-tight text-foreground"
              >
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-muted transition hover:bg-surface-raised hover:text-foreground disabled:opacity-50 dark:hover:bg-white/5 cursor-pointer"
            aria-label={cancelLabel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-brand/10 bg-[#f7f9ff] px-5 py-4 sm:flex-row sm:justify-end dark:border-white/10 dark:bg-white/5 sm:px-6">
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={isLoading}
            onClick={onCancel}
            className="!rounded-xl"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            isLoading={isLoading}
            onClick={onConfirm}
            className={`!rounded-xl ${confirmClass || ''}`}
          >
            <span className="inline-flex items-center gap-2">
              {!isLoading ? <LogOut className="h-4 w-4" /> : null}
              {confirmLabel}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
