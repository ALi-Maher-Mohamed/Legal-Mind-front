'use client';

import { useConsultationRoom } from '../../hooks/useConsultationRoom';
import LauncherView from './LauncherView';
import ActiveWorkspace from './ActiveWorkspace';
import SourceViewerModal from './SourceViewerModal';
import HistoryModal from './HistoryModal';

export default function ConsultationRoom() {
  const room = useConsultationRoom();

  return (
    <div className="relative flex h-[calc(100vh-10rem)] flex-col sm:h-[calc(100vh-11rem)]">
      {!room.activeConv ? (
        <LauncherView
          conversations={room.conversations}
          onCreate={room.createConversation}
          onOpenHistory={() => room.setShowHistory(true)}
        />
      ) : (
        <ActiveWorkspace
          conversation={room.activeConv}
          citations={room.citations}
          inputText={room.inputText}
          setInputText={room.setInputText}
          isSending={room.isSending}
          toast={room.toast}
          speakingMsgId={room.speakingMsgId}
          speechRate={room.speechRate}
          activeCitation={room.activeCitation}
          onShare={() => room.flashToast('share')}
          onExport={() => room.flashToast('export')}
          onOpenHistory={() => room.setShowHistory(true)}
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
      )}

      {room.viewerSource && (
        <SourceViewerModal
          source={room.viewerSource}
          onClose={() => room.setViewerSource(null)}
        />
      )}

      {room.showHistory && (
        <HistoryModal
          conversations={room.conversations}
          activeId={room.activeConv?.id ?? null}
          onSelect={room.selectConversation}
          onCreate={room.createConversation}
          onClose={() => room.setShowHistory(false)}
        />
      )}
    </div>
  );
}
