'use client';

import type { DraftVersion } from '@/types/drafter.types';
import { drafterCopy as c } from '../../data/drafterCopy';
import { dashPanel } from '../../lib/panelStyles';
import ContractRichEditor from './editor/ContractRichEditor';

type Props = {
  content: string;
  onChange: (v: string) => void;
  history: DraftVersion[];
  activeVersion: string;
  onRestore: (v: string) => void;
  onCommitVersion: () => void;
  spanClass?: string;
  editable?: boolean;
};

export default function EditorSheet({
  content,
  onChange,
  history,
  activeVersion,
  onRestore,
  onCommitVersion,
  spanClass = '',
  editable = true,
}: Props) {
  return (
    <div
      className={`${dashPanel} flex h-full min-h-0 flex-col overflow-hidden p-3 sm:p-4 md:p-5 lg:p-6 ${spanClass}`}
    >
      <ContractRichEditor content={content} onChange={onChange} editable={editable} />

      <div className="mt-3 flex shrink-0 flex-col items-stretch justify-between gap-2.5 border-t border-brand/10 pt-3 text-xs dark:border-white/10 sm:mt-4 sm:flex-row sm:items-center sm:gap-3 sm:pt-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="shrink-0 text-muted">{c.history}</span>
          <div className="flex max-w-full gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {history.map((hist) => (
              <button
                key={hist.v}
                type="button"
                title={hist.date}
                onClick={() => onRestore(hist.v)}
                className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] cursor-pointer ${
                  hist.v === activeVersion
                    ? 'border-brand bg-brand text-on-brand'
                    : 'border-brand/20 bg-white text-muted hover:border-brand dark:border-white/15 dark:bg-white/5'
                }`}
              >
                {hist.v}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onCommitVersion}
          className="shrink-0 text-start font-bold uppercase tracking-wider text-[10px] text-brand hover:opacity-80 sm:text-end cursor-pointer"
        >
          {c.commitVersion} ({activeVersion})
        </button>
      </div>
    </div>
  );
}
