'use client';

import { Sparkles, X } from 'lucide-react';
import { gazetteCopy as c } from '../../../data/gazetteCopy';

const TOOLTIPS: Record<string, string> = {
  'cl-1':
    'يحتوي البند ٢ على قيود السرية. تم تصنيفه كنموذج معياري لكن يتطلب استثناءات واضحة للأسرار التجارية.',
  'cl-2':
    'يحدد البند ٣ براءات الاختراع والملكية الفكرية. تم تأكيده كـ «عمل لصالح الغير» بثقة ٩٨٪.',
  'cl-3':
    'يؤدي البند ٨ إلى تفعيل ولاية ديلاوير القضائية، مما يرفع تكلفة التقاضي لمكاتب القاهرة.',
  'cl-4':
    '⚠️ البند ٩ يفعل مخاطر مسؤولية عالية بسبب التعويض غير المحدود. نقترح وضع سقف للتعويضات.',
};

type Props = {
  highlightId: string;
  onClose: () => void;
  onInspect: (tab: 'risks' | 'clauses') => void;
};

export default function HighlightTooltip({ highlightId, onClose, onInspect }: Props) {
  return (
    <div className="absolute inset-x-4 bottom-4 rounded-xl border border-brand/20 bg-white p-4 shadow-xl dark:border-white/15 dark:bg-card sm:inset-x-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-2 end-2 text-muted hover:text-foreground cursor-pointer"
        aria-label="إغلاق"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        {c.highlightLabel}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted">{TOOLTIPS[highlightId]}</p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => onInspect(highlightId === 'cl-4' ? 'risks' : 'clauses')}
          className="text-[10px] font-bold uppercase tracking-wider text-brand hover:opacity-80 cursor-pointer"
        >
          {c.inspectPanel}
        </button>
      </div>
    </div>
  );
}
