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
  const { t, isRtl } = useLanguage();

  return (
    <DashPanel>
      <div className="mb-4 flex items-center justify-between border-b border-brand/15 pb-4 dark:border-white/10">
        <h2 className="text-lg font-bold text-foreground">{t.dashboard.activeCases}</h2>
        <button
          type="button"
          onClick={onOpenLibrary}
          className="inline-flex items-center gap-0.5 text-xs text-brand hover:opacity-80 cursor-pointer"
        >
          {t.dashboard.viewLibrary}
          <ChevronRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {documents.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted">{t.dashboard.noDocuments}</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
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
