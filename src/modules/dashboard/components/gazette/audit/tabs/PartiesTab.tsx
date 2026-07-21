'use client';

import type { GazetteDocument } from '@/types/gazette.types';
import { gazetteCopy as c } from '../../../../data/gazetteCopy';

type Props = { doc: GazetteDocument };

export default function PartiesTab({ doc }: Props) {
  const parties = doc.parties ?? [];

  return (
    <div className="space-y-4">
      <h4 className="border-b border-brand/10 pb-2 text-lg font-bold text-foreground dark:border-white/10">
        {c.partiesTitle}
      </h4>

      {parties.length === 0 ? (
        <p className="py-12 text-center text-xs italic text-muted">{c.noParties}</p>
      ) : (
        <div className="space-y-4">
          {parties.map((party) => (
            <div
              key={party.id}
              className="rounded-xl border border-brand/15 bg-[#f8faff] p-4 dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-brand/10 pb-2 dark:border-white/10">
                <h5 className="text-sm font-bold text-foreground">{party.name}</h5>
                <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase text-on-brand">
                  {party.role}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                <div>
                  <span className="block text-[9px] font-bold uppercase text-muted">{c.rights}</span>
                  <p className="mt-1 italic leading-relaxed text-muted">&ldquo;{party.rights}&rdquo;</p>
                </div>
                <div>
                  <span className="block text-[9px] font-bold uppercase text-muted">{c.obligations}</span>
                  <p className="mt-1 italic leading-relaxed text-muted">
                    &ldquo;{party.obligations}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
