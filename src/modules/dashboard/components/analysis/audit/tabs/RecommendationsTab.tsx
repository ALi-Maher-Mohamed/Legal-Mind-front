'use client';

import { Check } from 'lucide-react';
import type { AnalysisDocument } from '@/types/analysis.types';
import { analysisCopy as c } from '../../../../data/analysisCopy';

type Props = { doc: AnalysisDocument };

export default function RecommendationsTab({ doc }: Props) {
  const recommendations = doc.result?.overall.recommendations ?? [];

  return (
    <div className="space-y-4">
      <h4 className="border-b border-brand/10 pb-2 text-lg font-bold text-foreground dark:border-white/10">
        {c.recommendationsTitle} ({recommendations.length})
      </h4>

      {recommendations.length === 0 ? (
        <p className="py-12 text-center text-xs italic text-muted">{c.noRecommendations}</p>
      ) : (
        <ul className="space-y-3">
          {recommendations.map((item, index) => (
            <li
              key={`${index}-${item}`}
              className="flex items-start gap-2.5 rounded-xl border border-brand/15 bg-surface-raised p-4 text-xs leading-relaxed text-muted dark:border-white/10 dark:bg-white/5"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
