'use client';

import { useGazetteRoom } from '../../hooks/useGazetteRoom';
import LibraryWorkspace from './LibraryWorkspace';
import AuditView from './audit/AuditView';

export default function GazetteRoom() {
  const room = useGazetteRoom();

  if (room.activeDoc) {
    const live =
      room.documents.find((d) => d.id === room.activeDoc?.id) ?? room.activeDoc;

    return (
      <AuditView
        doc={live}
        highlightId={room.highlightId}
        onHighlight={room.setHighlightId}
        onBack={room.closeAudit}
      />
    );
  }

  return (
    <LibraryWorkspace
      documents={room.filteredDocs}
      isListView={room.isListView}
      setIsListView={room.setIsListView}
      searchQuery={room.searchQuery}
      setSearchQuery={room.setSearchQuery}
      filterType={room.filterType}
      setFilterType={room.setFilterType}
      analyzingId={room.analyzingId}
      onUpload={room.uploadDocument}
      onOpen={room.openAudit}
      onAudit={room.runAudit}
    />
  );
}
