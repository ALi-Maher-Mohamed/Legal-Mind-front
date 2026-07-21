'use client';

import type { GazetteDocument } from '@/types/gazette.types';
import { gazetteCopy as c } from '../../../../data/gazetteCopy';

type Props = { doc: GazetteDocument };

export default function ClausesTab({ doc }: Props) {
  const clauses = doc.clauses ?? [];

  return (
    <div className="space-y-4">
      <h4 className="border-b border-brand/10 pb-2 text-lg font-bold text-foreground dark:border-white/10">
        {c.clausesTitle} ({clauses.length})
      </h4>

      {clauses.length === 0 ? (
        <p className="py-12 text-center text-xs italic text-muted">{c.noClauses}</p>
      ) : (
        <div className="space-y-4">
          {clauses.map((cl) => (
            <div
              key={cl.id}
              className="relative rounded-xl border border-brand/15 bg-[#f8faff] p-4 transition hover:border-accent dark:border-white/10 dark:bg-white/5"
            >
              <span className="absolute top-2 end-2 text-[10px] font-bold uppercase text-muted">
                {c.clauseTypes[cl.type] ?? cl.type}
              </span>
              <h5 className="mt-4 text-xs font-bold text-foreground sm:text-sm">{cl.title}</h5>
              <p className="mt-2 border-s border-brand/20 ps-2 text-xs italic leading-relaxed text-muted">
                &ldquo;{cl.text}&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] text-muted">{c.confidence}</span>
                <div className="h-1.5 max-w-24 flex-1 overflow-hidden rounded-full bg-brand/10 dark:bg-white/10">
                  <div className="h-full bg-accent" style={{ width: `${cl.confidence}%` }} />
                </div>
                <span className="text-[10px] font-bold text-accent">{cl.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
