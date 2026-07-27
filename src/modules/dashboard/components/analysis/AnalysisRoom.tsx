'use client';

import { useAnalysisRoom } from '../../hooks/useAnalysisRoom';
import { analysisCopy as c } from '../../data/analysisCopy';
import ConfirmModal from '../ui/ConfirmModal';
import LibraryWorkspace from './LibraryWorkspace';
import AuditView from './audit/AuditView';
import AnalysisStreamModal from './AnalysisStreamModal';
import { AuditViewSkeleton } from './ui/AnalysisShimmer';

export default function AnalysisRoom() {
  const room = useAnalysisRoom();

  return (
    <>
      {room.activeDoc ? (
        room.isOpeningAudit || !room.activeDoc.result ? (
          <AuditViewSkeleton onBack={room.closeAudit} />
        ) : (
          <AuditView
            doc={room.documents.find((d) => d.id === room.activeDoc?.id) ?? room.activeDoc}
            highlightId={room.highlightId}
            onHighlight={room.setHighlightId}
            onBack={room.closeAudit}
            onDownload={() => void room.downloadReport(room.activeDoc!)}
          />
        )
      ) : (
        <LibraryWorkspace
          documents={room.filteredDocs}
          isListView={room.isListView}
          setIsListView={room.setIsListView}
          searchQuery={room.searchQuery}
          setSearchQuery={room.setSearchQuery}
          filterType={room.filterType}
          setFilterType={room.setFilterType}
          analyzingId={room.analyzingId}
          isLoadingList={room.isLoadingList}
          onUpload={room.uploadDocument}
          onOpen={(doc) => void room.openAudit(doc)}
          onAudit={(id) => void room.runAudit(id)}
          onDelete={room.requestDelete}
          onWatchStream={room.openStream}
        />
      )}

      <AnalysisStreamModal
        open={Boolean(room.streamDoc)}
        doc={room.streamDoc}
        onClose={room.closeStream}
      />

      <ConfirmModal
        open={Boolean(room.deleteTarget)}
        title={c.deleteTitle}
        description={c.deleteDesc}
        confirmLabel={c.deleteBtn}
        cancelLabel={c.deleteCancel}
        isLoading={room.isDeleting}
        onConfirm={() => void room.confirmDelete()}
        onCancel={room.cancelDelete}
      />
    </>
  );
}
