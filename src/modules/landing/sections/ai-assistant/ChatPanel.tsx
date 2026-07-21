'use client';

import { Card } from '@/components/ui';
import { useLanguage } from '@/hooks/useLanguage';
import { useChatPreview } from '../../hooks/useChatPreview';
import { formatChatTime } from '../../lib/formatChatTime';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatSuggestions from './ChatSuggestions';
import ChatAttachmentBar from './ChatAttachmentBar';
import ChatInput from './ChatInput';

export default function ChatPanel() {
  const { t } = useLanguage();
  const chat = useChatPreview();

  return (
    <Card
      glowColor="rgba(59, 130, 246, 0.25)"
      className="border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden h-[500px] flex flex-col"
    >
      <ChatHeader />
      <ChatMessages
        welcomeMessage={t.aiPreview.welcomeMessage}
        welcomeTimestamp={formatChatTime()}
        messages={chat.messages}
        isTyping={chat.isTyping}
        messagesEndRef={chat.messagesEndRef}
      />
      <ChatSuggestions
        visible={chat.showSuggestions}
        used={chat.usedSuggestions}
        onSelect={chat.handleSuggestionClick}
      />
      <ChatAttachmentBar files={chat.attachedFiles} onRemove={chat.removeAttachment} />
      <ChatInput
        inputValue={chat.inputValue}
        hasAttachment={chat.attachedFiles.length > 0}
        fileInputRef={chat.fileInputRef}
        onInputChange={chat.setInputValue}
        onKeyDown={chat.handleKeyPress}
        onSend={() => chat.handleSend()}
        onFileTrigger={chat.triggerFileUpload}
        onFileChange={chat.handleFileChange}
      />
    </Card>
  );
}
