'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Attachment } from '@/types/chat.types';
import { chatService } from '@/services/chat.service';
import { formatChatTime } from '../lib/formatChatTime';

export function useChatPreview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
  const [suggestionsDismissed, setSuggestionsDismissed] = useState<{
    lease: boolean;
    developer: boolean;
  }>({ lease: false, developer: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length === 0 && !isTyping) return;
    const container = messagesEndRef.current?.parentElement;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(
    async (textToSend = inputValue, overrideAttachments = attachedFiles) => {
      const text = textToSend.trim();
      if (!text && overrideAttachments.length === 0) return;

      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: text || 'مستند مرفق للتحليل',
        timestamp: formatChatTime(),
        attachments: overrideAttachments,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setAttachedFiles([]);
      setIsTyping(true);

      try {
        const reply = await chatService.sendMessage(text, overrideAttachments);
        setIsTyping(false);
        setMessages((prev) => [...prev, reply]);
      } catch (err) {
        setIsTyping(false);
        console.error(err);
      }
    },
    [inputValue, attachedFiles],
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFiles([{ name: file.name, size: file.size, type: file.type }]);
  };

  const removeAttachment = () => {
    setAttachedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSuggestionClick = (promptKey: 'lease' | 'developer') => {
    if (suggestionsDismissed[promptKey]) return;
    setSuggestionsDismissed((prev) => ({ ...prev, [promptKey]: true }));
    if (promptKey === 'lease') {
      handleSend('حلل عقد الإيجار المرفق', [
        { name: 'lease_agreement_draft.pdf', size: 126900, type: 'application/pdf' },
      ]);
      return;
    }
    handleSend('صياغة عقد عمل لمطور برمجيات مستقل', []);
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    attachedFiles,
    usedSuggestions: suggestionsDismissed,
    showSuggestions: !suggestionsDismissed.lease || !suggestionsDismissed.developer,
    messagesEndRef,
    fileInputRef,
    handleSend,
    handleKeyPress,
    triggerFileUpload,
    handleFileChange,
    removeAttachment,
    handleSuggestionClick,
  };
}
