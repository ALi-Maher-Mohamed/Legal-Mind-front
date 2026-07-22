'use client';

import { useConsultationRoom } from '../../hooks/useConsultationRoom';
import ActiveWorkspace from './ActiveWorkspace';
import SourceViewerModal from './SourceViewerModal';

export default function ConsultationRoom() {
  const room = useConsultationRoom();

  return (
    <div className="relative flex h-[calc(100vh-10rem)] flex-col sm:h-[calc(100vh-11rem)]">
      <ActiveWorkspace
        conversations={room.conversations}
        conversation={room.activeConv}
        citations={room.citations}
        inputText={room.inputText}
        setInputText={room.setInputText}
        isSending={room.isSending}
        toast={room.toast}
        speakingMsgId={room.speakingMsgId}
        speechRate={room.speechRate}
        activeCitation={room.activeCitation}
        showHistory={room.showHistory}
        onShare={() => room.flashToast('share')}
        onExport={() => room.flashToast('export')}
        onToggleHistory={() => room.setShowHistory((v) => !v)}
        onCloseHistory={() => room.setShowHistory(false)}
        onSelectConversation={room.selectConversation}
        onNewConversation={room.createGeneral}
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
    </div>
  );
}
