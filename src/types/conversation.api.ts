/** API shapes from `/api/v1/conversations` (backend-ts). */

export type ConversationStatus = 'active' | 'archived';

export type ApiConversation = {
  conversation_id: string;
  title: string;
  status: ConversationStatus | string;
  jurisdiction?: string;
  summary?: unknown;
  summary_version?: number;
  active_legal_context?: unknown;
  message_count: number;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiMessageRole = 'user' | 'assistant' | 'system';
export type ApiMessageStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export type ApiSourceSnapshot = {
  sourceId?: string;
  source_id?: string;
  chunkId?: string;
  chunk_id?: string;
  authorityId?: string;
  authorityTitleOfficial?: string;
  authority_title_official?: string;
  articleNumber?: string;
  article_number?: string;
  lawNumber?: string;
  law_number?: string;
  lawYear?: string;
  law_year?: string;
  excerpt?: string;
  officialSourceUrl?: string;
  official_source_url?: string;
  page?: number;
};

export type ApiMessage = {
  message_id: string;
  conversation_id: string;
  role: ApiMessageRole;
  status: ApiMessageStatus | string;
  sequence: number;
  content: string;
  original_query?: string;
  retrieval_query?: string;
  category?: 'arabic_rag' | 'law_ref' | 'chat' | string;
  source_snapshot?: ApiSourceSnapshot[] | null;
  diagnostics?: unknown;
  idempotency_key?: string;
  error?: { code?: string; safeMessage?: string } | unknown;
  created_at: string;
  updated_at: string;
};

export type ListConversationsResponse = {
  conversations: ApiConversation[];
  next_cursor: string | null;
};

export type ListMessagesResponse = {
  messages: ApiMessage[];
  next_cursor: string | null;
};

export type SendMessageResponse = {
  user_message: ApiMessage;
  assistant_message: ApiMessage | null;
};
