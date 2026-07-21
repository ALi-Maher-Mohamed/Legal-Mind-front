'use client';

import { AlertTriangle, Check } from 'lucide-react';
import type { GazetteDocument } from '@/types/gazette.types';
import { gazetteCopy as c } from '../../../../data/gazetteCopy';

type Props = { doc: GazetteDocument };

export default function SummaryTab({ doc }: Props) {
  return (
    <div className="space-y-4">
      <h4 className="border-b border-brand/10 pb-2 text-lg font-bold text-foreground dark:border-white/10">
        {c.summaryTitle}
      </h4>
      <p className="rounded-lg border-s-2 border-accent bg-[#f0f4ff]/80 py-3 ps-4 text-sm leading-relaxed italic text-muted dark:bg-white/5">
        {doc.summary || c.summaryFallback}
      </p>

      <div className="pt-2">
        <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand">{c.takeaways}</h5>
        <ul className="space-y-3.5">
          <li className="flex items-start gap-2.5 text-xs leading-relaxed text-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
            <span>{c.takeaway1}</span>
          </li>
          <li className="flex items-start gap-2.5 text-xs leading-relaxed text-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
            <span>{c.takeaway2}</span>
          </li>
          <li className="flex items-start gap-2.5 text-xs leading-relaxed text-muted">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" strokeWidth={2.5} />
            <span className="font-semibold text-foreground">{c.takeaway3}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
