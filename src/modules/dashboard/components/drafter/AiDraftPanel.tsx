"use client";

import { Sparkles, X } from "lucide-react";
import type { DraftOutputLang } from "@/types/drafter.types";
import { drafterCopy as c } from "../../data/drafterCopy";
import { DRAFTER_PROMPTS } from "../../data/drafterClauses.data";
import { dashPanel } from "../../lib/panelStyles";

type Props = {
  prompt: string;
  onPromptChange: (v: string) => void;
  language: DraftOutputLang;
  onLanguageChange: (v: DraftOutputLang) => void;
  isDrafting: boolean;
  draftProgress?: { progress: number; stage: string } | null;
  onSubmit: () => void;
  onCancel?: () => void;
};

const LANGS: DraftOutputLang[] = ["Arabic", "English", "Bilingual"];

export default function AiDraftPanel({
  prompt,
  onPromptChange,
  language,
  onLanguageChange,
  isDrafting,
  draftProgress = null,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className={`${dashPanel} relative overflow-hidden p-4 sm:p-6 md:p-8`}>
      <Sparkles className="pointer-events-none absolute -end-4 -top-4 hidden h-28 w-28 text-brand opacity-[0.04] sm:block" />
      <h3 className="mb-4 flex items-start gap-1.5 border-b border-brand/10 pb-3 text-base font-bold leading-snug text-foreground dark:border-white/10 sm:mb-5 sm:items-center sm:text-lg">
        <Sparkles
          className="mt-0.5 h-5 w-5 shrink-0 animate-pulse text-accent sm:mt-0"
          strokeWidth={2}
        />
        <span>{c.aiTitle}</span>
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={c.aiPlaceholder}
          required
          rows={4}
          disabled={isDrafting}
          className="w-full rounded-xl border border-brand/20 bg-[#f8faff] p-3 text-xs leading-relaxed text-foreground placeholder:italic placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5 sm:p-4 sm:text-sm"
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="shrink-0 text-[10px] font-bold uppercase text-muted">
            {c.readyPrompts}
          </span>
          <div className="flex flex-wrap gap-2">
            {DRAFTER_PROMPTS.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => onPromptChange(ex.text)}
                disabled={isDrafting}
                className="rounded-lg border border-brand/15 bg-[#f0f4ff] px-2.5 py-1.5 text-[10px] italic text-brand hover:border-accent disabled:opacity-50 dark:border-white/10 dark:bg-white/5 cursor-pointer"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-brand/10 pt-4 dark:border-white/10 md:flex-row md:items-center justify-between  md:gap-4">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            {isDrafting && onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-danger/30 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-danger hover:bg-danger/5 md:w-auto cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                {c.cancelDraft}
              </button>
            ) : null}
            <button
              type="submit"
              disabled={!prompt.trim() || isDrafting}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-brand hover:opacity-90 disabled:opacity-40 md:w-auto md:px-6 cursor-pointer"
            >
              <span className="truncate">
                {isDrafting
                  ? draftProgress
                    ? `${draftProgress.stage || c.drafting} ${draftProgress.progress}%`
                    : c.drafting
                  : c.draftCta}
              </span>
              {!isDrafting && (
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
              )}
            </button>
          </div>
        </div>  

        {isDrafting && draftProgress ? (
          <div className="space-y-1.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-brand/10 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, draftProgress.progress))}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-muted">
              {draftProgress.stage || c.drafting} — {draftProgress.progress}%
            </p>
          </div>
        ) : null}
      </form>
    </div>
  );
}
