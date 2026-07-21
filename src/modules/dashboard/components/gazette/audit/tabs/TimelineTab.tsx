'use client';

import type { GazetteDocument } from '@/types/gazette.types';
import { gazetteCopy as c } from '../../../../data/gazetteCopy';

type Props = { doc: GazetteDocument };

export default function TimelineTab({ doc }: Props) {
  const items = doc.timeline ?? [];

  return (
    <div className="space-y-4">
      <h4 className="mb-6 border-b border-brand/10 pb-2 text-lg font-bold text-foreground dark:border-white/10">
        {c.timelineTitle}
      </h4>

      {items.length === 0 ? (
        <p className="py-12 text-center text-xs italic text-muted">{c.noTimeline}</p>
      ) : (
        <div className="relative ms-3 space-y-6 border-s-2 border-brand/25 ps-6">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <span className="absolute -start-[31px] top-1 h-3 w-3 rounded-full border-2 border-white bg-brand dark:border-card" />
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold uppercase text-brand">
                <span>{item.date}</span>
                <span className="text-muted">
                  {c.responsible}: {item.party}
                </span>
              </div>
              <h5 className="mt-0.5 text-xs font-bold text-foreground">{item.description}</h5>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
