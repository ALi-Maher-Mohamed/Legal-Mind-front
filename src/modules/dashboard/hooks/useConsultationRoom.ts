'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Conversation, Citation } from '@/types/consultation.types';
import { CONSULT_CONVERSATIONS } from '../data/consultConversations.data';
import { consultCopy as c } from '../data/consultCopy';
import { buildMockReply, collectCitations } from '../lib/consultHelpers';
import { useSpeechRead } from './useSpeechRead';

function freshGeneral(): Conversation {
  return {
    id: `conv-${Date.now()}`,
    title: c.newTitles.general,
    contextType: 'general',
    messages: [],
  };
}

export function useConsultationRoom() {
  const [boot] = useState(() => {
    const fresh = freshGeneral();
    return { conversations: [fresh, ...CONSULT_CONVERSATIONS], activeId: fresh.id };
  });
  const [conversations, setConversations] = useState(boot.conversations);
  const [activeId, setActiveId] = useState(boot.activeId);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState<'share' | 'export' | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [viewerSource, setViewerSource] = useState<Citation | null>(null);

  const activeConv = useMemo(
    () => conversations.find((conv) => conv.id === activeId) ?? conversations[0],
    [conversations, activeId],
  );
  const citations = useMemo(
    () => collectCitations(activeConv.messages),
    [activeConv],
  );
  const speech = useSpeechRead(activeId);

  const createGeneral = useCallback(() => {
    const fresh = freshGeneral();
    setConversations((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
    setShowHistory(false);
    setInputText('');
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setShowHistory(false);
    setInputText('');
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
          conv.id === activeId ? { ...conv, messages: [...conv.messages, userMsg] } : conv,
        ),
      );
      await new Promise((r) => setTimeout(r, 1100));
      const reply = buildMockReply(text.trim());
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeId ? { ...conv, messages: [...conv.messages, reply] } : conv,
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
    createGeneral,
    sendMessage,
    selectConversation,
    flashToast,
    ...speech,
  };
}
