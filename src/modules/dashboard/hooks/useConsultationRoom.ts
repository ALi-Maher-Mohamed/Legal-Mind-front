'use client';

import { useCallback, useMemo, useState } from 'react';
import type { ContextType, Conversation, Citation } from '@/types/consultation.types';
import { CONSULT_CONVERSATIONS } from '../data/consultConversations.data';
import { consultCopy as c } from '../data/consultCopy';
import { buildMockReply, collectCitations } from '../lib/consultHelpers';
import { useSpeechRead } from './useSpeechRead';

export function useConsultationRoom() {
  const [conversations, setConversations] = useState<Conversation[]>(CONSULT_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState<'share' | 'export' | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [viewerSource, setViewerSource] = useState<Citation | null>(null);

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );
  const citations = useMemo(
    () => (activeConv ? collectCitations(activeConv.messages) : []),
    [activeConv],
  );
  const speech = useSpeechRead(activeId);

  const createConversation = useCallback((type: ContextType) => {
    const id = `conv-${Date.now()}`;
    setConversations((prev) => [
      { id, title: c.newTitles[type], contextType: type, messages: [] },
      ...prev,
    ]);
    setActiveId(id);
    setShowHistory(false);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!activeId || !text.trim() || isSending) return;
      setIsSending(true);
      setInputText('');
      const userMsg = {
        id: `msg-${Date.now()}`,
        role: 'user' as const,
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeId
            ? { ...conv, messages: [...conv.messages, userMsg] }
            : conv,
        ),
      );
      await new Promise((r) => setTimeout(r, 1100));
      const reply = buildMockReply(text.trim());
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeId
            ? { ...conv, messages: [...conv.messages, reply] }
            : conv,
        ),
      );
      setIsSending(false);
    },
    [activeId, isSending],
  );

  const flashToast = (kind: 'share' | 'export') => {
    setToast(kind);
    setTimeout(() => setToast(null), 3000);
  };

  return {
    conversations,
    activeConv,
    citations,
    inputText,
    setInputText,
    isSending,
    showHistory,
    setShowHistory,
    toast,
    activeCitation,
    setActiveCitation,
    viewerSource,
    setViewerSource,
    createConversation,
    sendMessage,
    selectConversation: setActiveId,
    flashToast,
    ...speech,
  };
}
