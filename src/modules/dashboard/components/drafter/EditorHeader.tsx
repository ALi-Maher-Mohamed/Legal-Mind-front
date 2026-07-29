'use client';

import { ArrowRight, Download, ShieldAlert, Sparkles } from 'lucide-react';
import { drafterCopy as c } from '../../data/drafterCopy';

type Props = {
  title: string;
  onTitleChange: (v: string) => void;
  showAiAssist: boolean;
  showRiskScanner: boolean;
  isSaving?: boolean;
  isDownloading?: boolean;
  canDownload?: boolean;
  onToggleAi: () => void;
  onToggleRisk: () => void;
  onBack: () => void;
  onSave: () => void;
  onDownload?: () => void;
};

export default function EditorHeader({
  title,
  onTitleChange,
  showAiAssist,
  showRiskScanner,
  isSaving = false,
  isDownloading = false,
  canDownload = false,
  onToggleAi,
  onToggleRisk,
  onBack,
  onSave,
  onDownload,
}: Props) {
  const toggleCls = (on: boolean) =>
    `inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer sm:flex-none sm:px-3 sm:py-1.5 sm:text-xs ${
      on
        ? 'border-brand/30 bg-brand/5 text-brand'
        : 'border-brand/15 bg-white text-muted dark:border-white/10 dark:bg-white/5'
    }`;

  return (
    <div className="flex flex-col gap-3 border-b border-brand/15 pb-3 dark:border-white/10 sm:gap-4 sm:pb-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 rounded-lg border border-brand/15 bg-white p-2 text-muted hover:border-brand hover:text-foreground dark:border-white/10 dark:bg-white/5 cursor-pointer"
          aria-label="رجوع"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="min-w-0 flex-1 border-b border-brand/20 bg-transparent p-1 text-base font-bold uppercase text-foreground focus:border-accent focus:outline-none sm:text-lg md:text-xl dark:border-white/20"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex w-full gap-2 sm:w-auto">
          <button type="button" onClick={onToggleAi} className={toggleCls(showAiAssist)}>
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{c.aiLibrary}</span>
          </button>
          <button type="button" onClick={onToggleRisk} className={toggleCls(showRiskScanner)}>
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{c.riskScanner}</span>
          </button>
        </div>

        <div className="flex w-full gap-2 sm:w-auto sm:flex-wrap">
          {onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              disabled={!canDownload || isSaving || isDownloading}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand/15 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-foreground hover:border-brand disabled:opacity-40 sm:flex-none sm:py-1.5 sm:text-xs dark:border-white/10 dark:bg-white/5 cursor-pointer"
            >
              <Download className={`h-3.5 w-3.5 ${isDownloading ? 'animate-pulse' : ''}`} />
              <span className="truncate">{isDownloading ? c.downloading : c.downloadCta}</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-brand px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-on-brand hover:opacity-90 disabled:opacity-50 sm:flex-none sm:px-5 sm:text-xs cursor-pointer"
          >
            {isSaving ? c.saving : c.commit}
          </button>
        </div>
      </div>
    </div>
  );
}
