'use client';

import type { AnalysisDocument } from '@/types/analysis.types';
import { analysisCopy as c } from '../../data/analysisCopy';
import { useAnalysisUpload } from '../../hooks/useAnalysisUpload';
import UploadZone from './UploadZone';
import LibraryToolbar from './LibraryToolbar';
import DocumentGrid from './DocumentGrid';
import DocumentList from './DocumentList';
import { LibraryGridSkeleton, LibraryListSkeleton } from './ui/AnalysisShimmer';

type Props = {
  documents: AnalysisDocument[];
  isListView: boolean;
  setIsListView: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
  analyzingId: string | null;
  isLoadingList: boolean;
  onUpload: (p: { file: File }) => Promise<void>;
  onOpen: (doc: AnalysisDocument) => void;
  onAudit: (id: string) => void;
  onDelete: (doc: AnalysisDocument) => void;
  onWatchStream: (doc: AnalysisDocument) => void;
};

export default function LibraryWorkspace(props: Props) {
  const upload = useAnalysisUpload({ onUpload: props.onUpload });

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="text-start">
        <span className="block text-xs font-bold uppercase tracking-widest text-brand">{c.eyebrow}</span>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{c.title}</h2>
        <p className="mt-1 text-sm text-muted">{c.subtitle}</p>
      </header>

      <UploadZone {...upload} />

      <LibraryToolbar
        searchQuery={props.searchQuery}
        onSearch={props.setSearchQuery}
        filterType={props.filterType}
        onFilter={props.setFilterType}
        isListView={props.isListView}
        onToggleView={props.setIsListView}
      />

      {props.isLoadingList ? (
        props.isListView ? (
          <LibraryListSkeleton />
        ) : (
          <LibraryGridSkeleton />
        )
      ) : props.documents.length === 0 ? (
        <p className="rounded-2xl border border-brand/10 bg-white py-16 text-center text-sm italic text-muted dark:border-white/10 dark:bg-white/5">
          {c.emptyLibrary}
        </p>
      ) : props.isListView ? (
        <DocumentList
          documents={props.documents}
          analyzingId={props.analyzingId}
          onOpen={props.onOpen}
          onAudit={props.onAudit}
          onDelete={props.onDelete}
          onWatchStream={props.onWatchStream}
        />
      ) : (
        <DocumentGrid
          documents={props.documents}
          analyzingId={props.analyzingId}
          onOpen={props.onOpen}
          onAudit={props.onAudit}
          onDelete={props.onDelete}
          onWatchStream={props.onWatchStream}
        />
      )}
    </div>
  );
}
