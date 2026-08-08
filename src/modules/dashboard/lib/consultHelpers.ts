import type {
  Citation,
  ConsultMessage,
  Conversation,
} from '@/types/consultation.types';
import type {
  ApiConversation,
  ApiMessage,
  ApiSourceSnapshot,
} from '@/types/conversation.api';

function pickString(...values: Array<string | undefined | null>): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function formatMessageTime(value?: string): string {
  if (!value) {
    return new Date().toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function mapSourceToCitation(source: ApiSourceSnapshot, index: number): Citation {
  const article = pickString(source.articleNumber, source.article_number);
  const lawNumber = pickString(source.lawNumber, source.law_number);
  const lawYear = pickString(source.lawYear, source.law_year);
  const title = pickString(
    source.authorityTitleOfficial,
    source.authority_title_official,
  );

  let sourceName = title || 'مرجع قانوني';
  if (!title && (lawNumber || article)) {
    sourceName = [
      lawNumber ? `قانون ${lawNumber}${lawYear ? ` لسنة ${lawYear}` : ''}` : '',
      article ? `مادة ${article}` : '',
    ]
      .filter(Boolean)
      .join(' — ');
  }

  const id =
    pickString(source.chunkId, source.chunk_id, source.sourceId, source.source_id) ||
    `cit-${index}`;

  return {
    id,
    sourceName,
    excerpt: pickString(source.excerpt) || '—',
    url: pickString(source.officialSourceUrl, source.official_source_url) || undefined,
    page: typeof source.page === 'number' ? source.page : undefined,
  };
}

export function mapApiMessage(message: ApiMessage): ConsultMessage {
  const snapshots = Array.isArray(message.source_snapshot)
    ? message.source_snapshot
    : [];

  return {
    id: message.message_id,
    role: message.role === 'system' ? 'system' : message.role,
    text: message.content || '',
    timestamp: formatMessageTime(message.created_at),
    status: message.status,
    sequence: message.sequence,
    citations: snapshots.map(mapSourceToCitation),
  };
}

export function mapApiConversation(
  conversation: ApiConversation,
  messages: ConsultMessage[] = [],
  options: {
    messagesLoaded?: boolean;
    messagesNextCursor?: string | null;
    hasMoreMessages?: boolean;
  } = {},
): Conversation {
  return {
    id: conversation.conversation_id,
    title: conversation.title || 'مشورة قانونية',
    contextType: 'general',
    messages,
    status: conversation.status,
    messageCount: conversation.message_count ?? messages.length,
    lastMessageAt: conversation.last_message_at,
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
    messagesLoaded: options.messagesLoaded ?? false,
    messagesNextCursor: options.messagesNextCursor ?? null,
    hasMoreMessages: options.hasMoreMessages ?? false,
  };
}

export function collectCitations(messages: ConsultMessage[]): Citation[] {
  const out: Citation[] = [];
  for (const msg of messages) {
    for (const cit of msg.citations ?? []) {
      if (!out.find((c) => c.id === cit.id)) out.push(cit);
    }
  }
  return out;
}

export function cleanSpeechText(text: string): string {
  return text
    .replace(/\[\d+\]/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/[*#_]/g, '');
}

export function upsertConversationList(
  prev: Conversation[],
  next: Conversation[],
): Conversation[] {
  const cached = new Map(
    prev.map((item) => [
      item.id,
      {
        messages: item.messages,
        messagesLoaded: item.messagesLoaded,
        messagesNextCursor: item.messagesNextCursor,
        hasMoreMessages: item.hasMoreMessages,
      },
    ]),
  );

  return next.map((item) => {
    const cache = cached.get(item.id);
    if (!cache?.messagesLoaded) return item;
    return {
      ...item,
      messages: cache.messages,
      messagesLoaded: true,
      messagesNextCursor: cache.messagesNextCursor,
      hasMoreMessages: cache.hasMoreMessages,
      messageCount: Math.max(item.messageCount ?? 0, cache.messages.length),
    };
  });
}

export function buildTranscript(conversation: Conversation): string {
  const lines = [
    `# ${conversation.title}`,
    `الحالة: ${conversation.status || 'active'}`,
    `عدد الرسائل: ${conversation.messageCount ?? conversation.messages.length}`,
    '',
    '---',
    '',
  ];

  for (const msg of conversation.messages) {
    const who =
      msg.role === 'user'
        ? 'المستشار'
        : msg.role === 'assistant'
          ? 'LegalMind'
          : 'النظام';
    lines.push(`## ${who} — ${msg.timestamp}`);
    lines.push(msg.text);
    if (msg.citations?.length) {
      lines.push('');
      lines.push('مراجع:');
      for (const cit of msg.citations) {
        lines.push(`- ${cit.sourceName}: ${cit.excerpt}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
