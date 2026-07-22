'use client';

import type { DraftVersion } from '@/types/drafter.types';
import { drafterCopy as c } from '../../data/drafterCopy';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  content: string;
  onChange: (v: string) => void;
  history: DraftVersion[];
  activeVersion: string;
  onRestore: (v: string) => void;
  onCommitVersion: () => void;
  spanClass: string;
};

export default function EditorSheet({
  content,
  onChange,
  history,
  activeVersion,
  onRestore,
  onCommitVersion,
  spanClass,
}: Props) {
  return (
    <div className={`${dashPanel} flex h-full flex-col justify-between overflow-hidden p-4 sm:p-6 ${spanClass}`}>
      <div className="mb-4 flex shrink-0 flex-wrap items-center gap-2 border-b border-brand/10 pb-3 text-xs text-muted dark:border-white/10">
        <span className="border-e border-brand/15 pe-2 font-bold text-foreground dark:border-white/15">
          {c.sheet}
        </span>
        <button type="button" className="px-1 font-bold hover:text-foreground">B</button>
        <button type="button" className="px-1 italic hover:text-foreground">I</button>
        <button type="button" className="px-1 underline hover:text-foreground">U</button>
        <span className="mx-1 h-4 border-e border-brand/15 dark:border-white/15" />
        <button type="button" className="px-1 text-[10px] hover:text-foreground">{c.paragraph}</button>
        <button type="button" className="px-1 text-[10px] hover:text-foreground">{c.lawIndex}</button>
      </div>

      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={c.editorPlaceholder}
        className="min-h-0 flex-1 w-full resize-none bg-transparent text-xs leading-loose text-foreground focus:outline-none sm:text-sm"
      />

      <div className="mt-4 flex shrink-0 flex-col items-start justify-between gap-3 border-t border-brand/10 pt-4 text-xs dark:border-white/10 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted">{c.history}</span>
          {history.map((hist) => (
            <button
              key={hist.v}
              type="button"
              title={hist.date}
              onClick={() => onRestore(hist.v)}
              className={`rounded border px-2 py-0.5 font-mono text-[10px] cursor-pointer ${
                hist.v === activeVersion
                  ? 'border-brand bg-brand text-on-brand'
                  : 'border-brand/20 bg-white text-muted hover:border-brand dark:border-white/15 dark:bg-white/5'
              }`}
            >
              {hist.v}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onCommitVersion}
          className="font-bold uppercase tracking-wider text-[10px] text-brand hover:opacity-80 cursor-pointer"
        >
          {c.commitVersion} ({activeVersion})
        </button>
      </div>
    </div>
  );
}
