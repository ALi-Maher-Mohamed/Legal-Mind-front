'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Attachment } from '@/types/chat.types';
import { chatService } from '@/services/chat.service';
import { Locale } from '@/config/translations';
import { formatChatTime } from '../lib/formatChatTime';

export function useChatPreview(locale: Locale, isRtl: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(
    async (textToSend = inputValue, overrideAttachments = attachedFiles) => {
      const text = textToSend.trim();
      if (!text && overrideAttachments.length === 0) return;

      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: text || (isRtl ? 'مستند مرفق للتحليل' : 'Uploaded document for analysis'),
        timestamp: formatChatTime(locale),
        attachments: overrideAttachments,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setAttachedFiles([]);
      setIsTyping(true);

      try {
        const reply = await chatService.sendMessage(text, locale, overrideAttachments);
        setIsTyping(false);
        setMessages((prev) => [...prev, reply]);
      } catch (err) {
        setIsTyping(false);
        console.error(err);
      }
    },
    [inputValue, attachedFiles, isRtl, locale],
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
    if (promptKey === 'lease') {
      handleSend(
        locale === 'ar' ? 'حلل عقد الإيجار المرفق' : 'Analyze this commercial lease contract.',
        [{ name: 'lease_agreement_draft.pdf', size: 126900, type: 'application/pdf' }],
      );
      return;
    }
    handleSend(
      locale === 'ar' ? 'صياغة عقد عمل لمطور برمجيات مستقل' : 'Draft a freelance software developer agreement.',
      [],
    );
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    attachedFiles,
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
