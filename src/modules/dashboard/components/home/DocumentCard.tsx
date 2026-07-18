import { FileText, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { LegalDocument } from '@/types/dashboard.types';

type Props = {
  doc: LegalDocument;
  accentClass: string;
  onOpen: () => void;
};

export default function DocumentCard({ doc, accentClass, onOpen }: Props) {
  const { t } = useLanguage();
  const done = doc.status === 'Analysis Complete';

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative w-52 shrink-0 rounded-xl border border-brand/15 border-s-4 bg-white p-4 text-start transition hover:border-brand/40 hover:shadow-[0_4px_12px_rgba(0,62,199,0.1)] dark:border-white/10 dark:bg-white/5 cursor-pointer ${accentClass}`}
    >
      <ArrowUpRight className="absolute top-2 end-2 h-4 w-4 text-brand opacity-0 transition group-hover:opacity-100" />
      <FileText className="mb-2 h-7 w-7 text-brand" strokeWidth={1.5} />
      <h3 className="truncate text-xs font-bold uppercase text-foreground">{doc.name}</h3>
      <p className="mt-1 text-[10px] text-muted">
        {doc.type} • {doc.size}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
            done ? 'bg-success/10 text-success' : 'bg-accent/15 text-accent'
          }`}
        >
          {done ? t.dashboard.audited : t.dashboard.pending}
        </span>
        <span className="text-[9px] text-muted">{doc.dateUploaded}</span>
      </div>
    </button>
  );
}
