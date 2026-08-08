'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  Conversation,
  Citation,
  ConversationFilter,
} from '@/types/consultation.types';
import {
  conversationsService,
  createIdempotencyKey,
} from '@/services/conversations.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { consultCopy as c } from '../data/consultCopy';
import {
  buildTranscript,
  collectCitations,
  downloadTextFile,
  mapApiConversation,
  mapApiMessage,
  upsertConversationList,
} from '../lib/consultHelpers';
import { useSpeechRead } from './useSpeechRead';

const MESSAGE_LIMIT = 50;
const LIST_LIMIT = 30;
const CONTENT_MAX = 2000;

export function useConsultationRoom() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ConversationFilter>('active');
  const [listCursor, setListCursor] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMoreList, setIsLoadingMoreList] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState<'share' | 'export' | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [viewerSource, setViewerSource] = useState<Citation | null>(null);
  const [loadError, setLoadError] = useState('');
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);

  const activeConv = useMemo(() => {
    if (!conversations.length) {
      return {
        id: '',
        title: c.newTitles.general,
        contextType: 'general' as const,
        messages: [],
        messageCount: 0,
        messagesLoaded: true,
        status: filter,
      };
    }
    return conversations.find((conv) => conv.id === activeId) ?? conversations[0];
  }, [conversations, activeId, filter]);

  const citations = useMemo(
    () => collectCitations(activeConv.messages),
    [activeConv.messages],
  );
  const speech = useSpeechRead(activeConv.id);

  const applyMessagesPage = useCallback(
    (
      conversationId: string,
      page: { messages: ReturnType<typeof mapApiMessage>[]; next_cursor: string | null },
      mode: 'replace' | 'prepend',
    ) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== conversationId) return conv;
          const merged =
            mode === 'replace'
              ? page.messages
              : [
                  ...page.messages.filter(
                    (msg) => !conv.messages.some((existing) => existing.id === msg.id),
                  ),
                  ...conv.messages,
                ];
          return {
            ...conv,
            messages: merged,
            messagesLoaded: true,
            messagesNextCursor: page.next_cursor,
            hasMoreMessages: Boolean(page.next_cursor),
            messageCount: Math.max(conv.messageCount ?? 0, merged.length),
          };
        }),
      );
    },
    [],
  );

  const loadMessages = useCallback(
    async (conversationId: string) => {
      setIsLoadingMessages(true);
      try {
        const result = await conversationsService.listMessages(conversationId, {
          limit: MESSAGE_LIMIT,
        });
        const messages = [...result.messages]
          .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
          .map(mapApiMessage);
        applyMessagesPage(
          conversationId,
          { messages, next_cursor: result.next_cursor },
          'replace',
        );
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [applyMessagesPage],
  );

  const loadOlderMessages = useCallback(async () => {
    if (!activeId || isLoadingOlder) return;
    const conv = conversations.find((item) => item.id === activeId);
    if (!conv?.hasMoreMessages || !conv.messagesNextCursor) return;

    setIsLoadingOlder(true);
    try {
      const result = await conversationsService.listMessages(activeId, {
        limit: MESSAGE_LIMIT,
        cursor: conv.messagesNextCursor,
      });
      const messages = [...result.messages]
        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
        .map(mapApiMessage);
      applyMessagesPage(
        activeId,
        { messages, next_cursor: result.next_cursor },
        'prepend',
      );
    } catch (error) {
      toastApiError(error);
    } finally {
      setIsLoadingOlder(false);
    }
  }, [activeId, applyMessagesPage, conversations, isLoadingOlder]);

  const bootstrap = useCallback(
    async (nextFilter: ConversationFilter = filter) => {
      setIsLoading(true);
      setLoadError('');
      try {
        const listed = await conversationsService.list({
          limit: LIST_LIMIT,
          status: nextFilter,
        });
        let items = listed.conversations.map((item) => mapApiConversation(item));
        setListCursor(listed.next_cursor);

        if (items.length === 0 && nextFilter === 'active') {
          const created = await conversationsService.create(c.newTitles.general);
          items = [mapApiConversation(created, [], { messagesLoaded: true })];
        }

        setConversations(items);
        const firstId = items[0]?.id ?? null;
        setActiveId(firstId);
        if (firstId) {
          await loadMessages(firstId);
        }
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : '');
        toastApiError(error);
        setConversations([]);
        setActiveId(null);
      } finally {
        setIsLoading(false);
      }
    },
    [filter, loadMessages],
  );

  useEffect(() => {
    void bootstrap('active');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  const switchFilter = useCallback(
    (next: ConversationFilter) => {
      if (next === filter) return;
      setFilter(next);
      setShowHistory(false);
      setActiveCitation(null);
      setInputText('');
      void bootstrap(next);
    },
    [bootstrap, filter],
  );

  const loadMoreConversations = useCallback(async () => {
    if (!listCursor || isLoadingMoreList) return;
    setIsLoadingMoreList(true);
    try {
      const listed = await conversationsService.list({
        limit: LIST_LIMIT,
        status: filter,
        cursor: listCursor,
      });
      const mapped = listed.conversations.map((item) => mapApiConversation(item));
      setConversations((prev) => {
        const ids = new Set(prev.map((item) => item.id));
        return [...prev, ...mapped.filter((item) => !ids.has(item.id))];
      });
      setListCursor(listed.next_cursor);
    } catch (error) {
      toastApiError(error);
    } finally {
      setIsLoadingMoreList(false);
    }
  }, [filter, isLoadingMoreList, listCursor]);

  const createGeneral = useCallback(
    async (title?: string) => {
      if (isCreating) return false;
      const nextTitle = title?.trim() ?? '';
      if (!nextTitle) return false;
      if (nextTitle.length > 160) {
        toastApiError(new Error('يجب ألا يتجاوز العنوان 160 حرفاً'));
        return false;
      }

      setIsCreating(true);
      try {
        const created = await conversationsService.create(nextTitle);
        const mapped = mapApiConversation(created, [], { messagesLoaded: true });

        if (filter !== 'active') {
          setFilter('active');
          const listed = await conversationsService.list({
            limit: LIST_LIMIT,
            status: 'active',
          });
          const rest = listed.conversations
            .filter((item) => item.conversation_id !== mapped.id)
            .map((item) => mapApiConversation(item));
          setConversations([mapped, ...rest]);
          setListCursor(listed.next_cursor);
        } else {
          setConversations((prev) => [mapped, ...prev]);
        }

        setActiveId(mapped.id);
        setShowHistory(false);
        setInputText('');
        setActiveCitation(null);
        setNewChatOpen(false);
        return true;
      } catch (error) {
        toastApiError(error);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [filter, isCreating],
  );

  const selectConversation = useCallback(
    async (id: string) => {
      setActiveId(id);
      setShowHistory(false);
      setInputText('');
      setActiveCitation(null);

      const existing = conversations.find((conv) => conv.id === id);
      if (existing?.messagesLoaded) return;

      try {
        await loadMessages(id);
      } catch (error) {
        toastApiError(error);
      }
    },
    [conversations, loadMessages],
  );

  const renameConversation = useCallback(
    async (title: string) => {
      if (!activeId || isMutating) return false;
      const nextTitle = title.trim();
      if (!nextTitle) return false;
      if (nextTitle.length > 160) {
        toastApiError(new Error('يجب ألا يتجاوز العنوان 160 حرفاً'));
        return false;
      }

      setIsMutating(true);
      try {
        const updated = await conversationsService.update(activeId, { title: nextTitle });
        const mapped = mapApiConversation(updated);
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeId
              ? {
                  ...conv,
                  title: mapped.title,
                  updatedAt: mapped.updatedAt,
                  status: mapped.status,
                }
              : conv,
          ),
        );
        setRenameOpen(false);
        return true;
      } catch (error) {
        toastApiError(error);
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [activeId, isMutating],
  );

  const archiveConversation = useCallback(
    async (targetStatus: 'archived' | 'active') => {
      if (!activeId || isMutating) return;
      setIsMutating(true);
      try {
        await conversationsService.update(activeId, { status: targetStatus });
        const remaining = conversations.filter((conv) => conv.id !== activeId);
        setConversations(remaining);
        setActiveCitation(null);
        if (remaining[0]) {
          setActiveId(remaining[0].id);
          if (!remaining[0].messagesLoaded) {
            await loadMessages(remaining[0].id);
          }
        } else {
          setActiveId(null);
        }
      } catch (error) {
        toastApiError(error);
      } finally {
        setIsMutating(false);
      }
    },
    [activeId, conversations, isMutating, loadMessages],
  );

  const deleteConversation = useCallback(async () => {
    if (!activeId || isMutating) return;
    setIsMutating(true);
    try {
      await conversationsService.remove(activeId);
      const remaining = conversations.filter((conv) => conv.id !== activeId);
      setConversations(remaining);
      setDeleteOpen(false);
      setActiveCitation(null);

      if (remaining[0]) {
        setActiveId(remaining[0].id);
        if (!remaining[0].messagesLoaded) {
          await loadMessages(remaining[0].id);
        }
      } else if (filter === 'active') {
        const created = await conversationsService.create(c.newTitles.general);
        const mapped = mapApiConversation(created, [], { messagesLoaded: true });
        setConversations([mapped]);
        setActiveId(mapped.id);
      } else {
        setActiveId(null);
      }
    } catch (error) {
      toastApiError(error);
    } finally {
      setIsMutating(false);
    }
  }, [activeId, conversations, filter, isMutating, loadMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!activeId || !content || isSending) return;
      if (activeConv.status === 'archived') {
        toastApiError(new Error('استعد الجلسة من الأرشيف قبل إرسال رسائل.'));
        return;
      }

      if (content.length > CONTENT_MAX) {
        toastApiError(new Error(`الرسالة يجب ألا تتجاوز ${CONTENT_MAX} حرفاً`));
        return;
      }

      setIsSending(true);
      setInputText('');

      const idempotencyKey = createIdempotencyKey();
      const tempUserId = `temp-user-${Date.now()}`;

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeId
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  {
                    id: tempUserId,
                    role: 'user',
                    text: content,
                    timestamp: new Date().toLocaleTimeString('ar-EG', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                    status: 'pending',
                  },
                ],
              }
            : conv,
        ),
      );

      try {
        const response = await conversationsService.sendMessage(activeId, {
          content,
          idempotency_key: idempotencyKey,
          top_k: 5,
        });

        const userMessage = mapApiMessage(response.user_message);
        const assistantMessage = response.assistant_message
          ? mapApiMessage(response.assistant_message)
          : null;

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id !== activeId) return conv;
            const withoutTemp = conv.messages.filter((msg) => msg.id !== tempUserId);
            const nextMessages = [
              ...withoutTemp,
              userMessage,
              ...(assistantMessage ? [assistantMessage] : []),
            ];
            return {
              ...conv,
              messages: nextMessages,
              messagesLoaded: true,
              messageCount: nextMessages.length,
              lastMessageAt: new Date().toISOString(),
            };
          }),
        );

        // Refresh list metadata (counts/timestamps) without clearing cache.
        try {
          const listed = await conversationsService.list({
            limit: LIST_LIMIT,
            status: filter,
          });
          setConversations((prev) =>
            upsertConversationList(
              prev,
              listed.conversations.map((item) => mapApiConversation(item)),
            ),
          );
          setListCursor(listed.next_cursor);
        } catch {
          // best-effort
        }
      } catch (error) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeId
              ? {
                  ...conv,
                  messages: conv.messages.filter((msg) => msg.id !== tempUserId),
                }
              : conv,
          ),
        );
        setInputText(content);
        toastApiError(error);
      } finally {
        setIsSending(false);
      }
    },
    [activeConv.status, activeId, filter, isSending],
  );

  const shareConversation = useCallback(async () => {
    if (!activeConv.id) return;
    try {
      const text = buildTranscript(activeConv);
      await navigator.clipboard.writeText(text);
      setToast('share');
      setTimeout(() => setToast(null), 2500);
      toastApiSuccess(c.shareOk);
    } catch {
      toastApiError(new Error(c.shareFail));
    }
  }, [activeConv]);

  const exportConversation = useCallback(() => {
    if (!activeConv.id) return;
    const safe = activeConv.title.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 40);
    downloadTextFile(
      `legalmind-${safe || activeConv.id}.md`,
      buildTranscript(activeConv),
    );
    setToast('export');
    setTimeout(() => setToast(null), 2500);
    toastApiSuccess(c.exportOk);
  }, [activeConv]);

  return {
    conversations,
    activeConv,
    citations,
    filter,
    switchFilter,
    listCursor,
    inputText,
    setInputText,
    isLoading,
    isLoadingMoreList,
    isLoadingMessages,
    isLoadingOlder,
    isSending,
    isCreating,
    isMutating,
    loadError,
    showHistory,
    setShowHistory,
    toast,
    activeCitation,
    setActiveCitation,
    viewerSource,
    setViewerSource,
    renameOpen,
    setRenameOpen,
    deleteOpen,
    setDeleteOpen,
    newChatOpen,
    setNewChatOpen,
    createGeneral,
    sendMessage,
    selectConversation,
    loadMoreConversations,
    loadOlderMessages,
    renameConversation,
    archiveConversation,
    deleteConversation,
    shareConversation,
    exportConversation,
    reload: () => bootstrap(filter),
    ...speech,
  };
}
