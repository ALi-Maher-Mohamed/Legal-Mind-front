'use client';

import { Trash2 } from 'lucide-react';
import { useConsultationRoom } from '../../hooks/useConsultationRoom';
import { consultCopy as c } from '../../data/consultCopy';
import { dashPanel } from '../../lib/panelStyles';
import ConfirmModal from '../ui/ConfirmModal';
import ActiveWorkspace from './ActiveWorkspace';
import ConsultationRoomSkeleton from './ConsultShimmer';
import RenameConversationModal from './RenameConversationModal';
import SourceViewerModal from './SourceViewerModal';

export default function ConsultationRoom() {
  const room = useConsultationRoom();

  if (room.isLoading) {
    return <ConsultationRoomSkeleton />;
  }

  if (!room.activeConv.id && room.filter === 'archived') {
    return (
      <div className="relative flex h-[calc(100vh-10rem)] flex-col gap-4 sm:h-[calc(100vh-11rem)] lg:flex-row">
        <div className="h-full w-full shrink-0 lg:w-72">
          <div className={`${dashPanel} h-full p-3 sm:p-4`}>
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl border border-brand/10 bg-[#f8faff] p-1 dark:border-white/10 dark:bg-white/5">
              <button
                type="button"
                onClick={() => room.switchFilter('active')}
                className="rounded-lg px-2 py-1.5 text-[11px] font-bold text-muted hover:text-foreground cursor-pointer"
              >
                {c.activeTab}
              </button>
              <button
                type="button"
                className="rounded-lg bg-brand px-2 py-1.5 text-[11px] font-bold text-on-brand cursor-pointer"
              >
                {c.archivedTab}
              </button>
            </div>
            <p className="p-4 text-center text-xs text-muted">{c.emptyList}</p>
          </div>
        </div>
        <div className={`${dashPanel} flex flex-1 items-center justify-center p-6 text-center text-sm text-muted`}>
          {c.emptyList}
        </div>
      </div>
    );
  }

  if (!room.activeConv.id) {
    return (
      <div
        className={`${dashPanel} flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-3 p-6 text-center sm:h-[calc(100vh-11rem)]`}
      >
        <p className="text-sm text-muted">{room.loadError || c.loadFail}</p>
        <button
          type="button"
          onClick={() => void room.reload()}
          className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-on-brand cursor-pointer"
        >
          {c.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-10rem)] flex-col sm:h-[calc(100vh-11rem)]">
      <ActiveWorkspace
        conversations={room.conversations}
        conversation={room.activeConv}
        citations={room.citations}
        filter={room.filter}
        inputText={room.inputText}
        setInputText={room.setInputText}
        isSending={room.isSending}
        isCreating={room.isCreating}
        isMutating={room.isMutating}
        isLoadingMessages={room.isLoadingMessages}
        isLoadingOlder={room.isLoadingOlder}
        isLoadingMoreList={room.isLoadingMoreList}
        hasMoreList={Boolean(room.listCursor)}
        toast={room.toast}
        speakingMsgId={room.speakingMsgId}
        speechRate={room.speechRate}
        activeCitation={room.activeCitation}
        showHistory={room.showHistory}
        onFilterChange={room.switchFilter}
        onShare={() => void room.shareConversation()}
        onExport={() => room.exportConversation()}
        onToggleHistory={() => room.setShowHistory((v) => !v)}
        onCloseHistory={() => room.setShowHistory(false)}
        onSelectConversation={(id) => void room.selectConversation(id)}
        onNewConversation={() => void room.createGeneral()}
        onLoadMoreList={() => void room.loadMoreConversations()}
        onLoadOlder={() => void room.loadOlderMessages()}
        onRename={() => room.setRenameOpen(true)}
        onArchive={() => void room.archiveConversation('archived')}
        onUnarchive={() => void room.archiveConversation('active')}
        onDelete={() => room.setDeleteOpen(true)}
        onSend={() => void room.sendMessage(room.inputText)}
        onSpeak={room.speakMessage}
        onRateChange={room.setSpeechRate}
        onStopSpeak={room.stopSpeaking}
        onToggleCitation={room.setActiveCitation}
        onCloseCitation={() => room.setActiveCitation(null)}
        onOpenViewer={(cit) => {
          room.setViewerSource(cit);
          room.setActiveCitation(null);
        }}
      />

      {room.viewerSource && (
        <SourceViewerModal
          source={room.viewerSource}
          onClose={() => room.setViewerSource(null)}
        />
      )}

      <RenameConversationModal
        open={room.renameOpen}
        initialTitle={room.activeConv.title}
        isLoading={room.isMutating}
        onClose={() => room.setRenameOpen(false)}
        onSave={(title) => room.renameConversation(title)}
      />

      <ConfirmModal
        open={room.deleteOpen}
        title={c.deleteTitle}
        description={c.deleteDesc}
        confirmLabel={c.deleteConfirm}
        cancelLabel={c.cancel}
        isLoading={room.isMutating}
        tone="danger"
        icon={Trash2}
        onCancel={() => {
          if (!room.isMutating) room.setDeleteOpen(false);
        }}
        onConfirm={() => void room.deleteConversation()}
      />
    </div>
  );
}
