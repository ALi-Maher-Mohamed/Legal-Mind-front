import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { LegalDocument } from '@/types/dashboard.types';
import DashPanel from '../ui/DashPanel';
import DocumentCard from './DocumentCard';

type Props = {
  documents: LegalDocument[];
  onOpenLibrary: () => void;
};

const ACCENTS = ['border-s-brand', 'border-s-accent', 'border-s-brand-deep'];

export default function DocumentsStrip({ documents, onOpenLibrary }: Props) {
  const { t } = useLanguage();

  return (
    <DashPanel className="!p-4 sm:!p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-foreground sm:text-lg">
          {t.dashboard.activeCases}
        </h2>
        <button
          type="button"
          onClick={onOpenLibrary}
          className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-brand hover:opacity-80 cursor-pointer"
        >
          {t.dashboard.viewLibrary}
          <ChevronRight className="h-3.5 w-3.5 rotate-180" />
        </button>
      </div>

      {documents.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brand/15 py-6 text-center text-xs text-muted dark:border-white/10">
          {t.dashboard.noDocuments}
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {documents.map((doc, idx) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              accentClass={ACCENTS[idx % ACCENTS.length]}
              onOpen={onOpenLibrary}
            />
          ))}
        </div>
      )}
    </DashPanel>
  );
}
