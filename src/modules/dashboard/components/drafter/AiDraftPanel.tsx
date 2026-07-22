'use client';

import { Sparkles } from 'lucide-react';
import type { DraftOutputLang } from '@/types/drafter.types';
import { drafterCopy as c } from '../../data/drafterCopy';
import { DRAFTER_PROMPTS } from '../../data/drafterClauses.data';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  prompt: string;
  onPromptChange: (v: string) => void;
  language: DraftOutputLang;
  onLanguageChange: (v: DraftOutputLang) => void;
  isDrafting: boolean;
  onSubmit: () => void;
};

const LANGS: DraftOutputLang[] = ['Arabic', 'English', 'Bilingual'];

export default function AiDraftPanel({
  prompt,
  onPromptChange,
  language,
  onLanguageChange,
  isDrafting,
  onSubmit,
}: Props) {
  return (
    <div className={`${dashPanel} relative overflow-hidden p-5 sm:p-8`}>
      <Sparkles className="pointer-events-none absolute -end-4 -top-4 h-28 w-28 text-brand opacity-[0.04]" />
      <h3 className="mb-5 flex items-center gap-1.5 border-b border-brand/10 pb-3 text-lg font-bold text-foreground dark:border-white/10">
        <Sparkles className="h-5 w-5 animate-pulse text-accent" strokeWidth={2} />
        {c.aiTitle}
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
          className="w-full rounded-xl border border-brand/20 bg-[#f8faff] p-4 text-xs leading-relaxed text-foreground placeholder:italic placeholder:text-muted focus:border-accent focus:outline-none dark:border-white/10 dark:bg-white/5 sm:text-sm"
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-muted">{c.readyPrompts}</span>
          {DRAFTER_PROMPTS.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => onPromptChange(ex.text)}
              className="rounded-lg border border-brand/15 bg-[#f0f4ff] px-2 py-1 text-[10px] italic text-brand hover:border-accent dark:border-white/10 dark:bg-white/5 cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-brand/10 pt-4 dark:border-white/10 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">{c.outputLang}</span>
            <div className="flex overflow-hidden rounded-lg border border-brand/15 text-xs dark:border-white/10">
              {LANGS.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`px-3 py-1.5 cursor-pointer ${
                    language === lang
                      ? 'bg-brand font-semibold text-on-brand'
                      : 'bg-white text-muted hover:text-foreground dark:bg-white/5'
                  }`}
                >
                  {lang === 'Arabic' ? c.langArabic : lang === 'English' ? c.langEnglish : c.langBilingual}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isDrafting}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-on-brand hover:opacity-90 disabled:opacity-40 sm:w-auto cursor-pointer"
          >
            {isDrafting ? c.drafting : c.draftCta}
            {!isDrafting && <Sparkles className="h-3.5 w-3.5 text-accent" />}
          </button>
        </div>
      </form>
    </div>
  );
}
