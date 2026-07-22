'use client';

import { ArrowRight } from 'lucide-react';
import { drafterCopy as c } from '../../data/drafterCopy';

type Props = {
  title: string;
  onTitleChange: (v: string) => void;
  showAiAssist: boolean;
  showRiskScanner: boolean;
  onToggleAi: () => void;
  onToggleRisk: () => void;
  onBack: () => void;
  onSave: () => void;
};

export default function EditorHeader({
  title,
  onTitleChange,
  showAiAssist,
  showRiskScanner,
  onToggleAi,
  onToggleRisk,
  onBack,
  onSave,
}: Props) {
  const toggleCls = (on: boolean) =>
    `rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer ${
      on
        ? 'border-brand/30 bg-brand/5 text-brand'
        : 'border-brand/15 bg-white text-muted dark:border-white/10 dark:bg-white/5'
    }`;

  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b border-brand/15 pb-4 dark:border-white/10 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-brand/15 bg-white p-2 text-muted hover:border-brand hover:text-foreground dark:border-white/10 dark:bg-white/5 cursor-pointer"
          aria-label="رجوع"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="max-w-[16rem] border-b border-brand/20 bg-transparent p-1 text-lg font-bold uppercase text-foreground focus:border-accent focus:outline-none sm:max-w-md sm:text-xl dark:border-white/20"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button type="button" onClick={onToggleAi} className={toggleCls(showAiAssist)}>
          {c.aiLibrary}
        </button>
        <button type="button" onClick={onToggleRisk} className={toggleCls(showRiskScanner)}>
          {c.riskScanner}
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-brand px-5 py-2 text-xs font-bold uppercase tracking-wider text-on-brand hover:opacity-90 cursor-pointer"
        >
          {c.commit}
        </button>
      </div>
    </div>
  );
}
