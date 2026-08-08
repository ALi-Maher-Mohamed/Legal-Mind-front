export type ContextType = 'general' | 'firm' | 'case' | 'kb';

export type ConversationFilter = 'active' | 'archived';

export type Citation = {
  id: string;
  sourceName: string;
  excerpt: string;
  page?: number;
  url?: string;
};

export type ConsultMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  status?: string;
  citations?: Citation[];
  sequence?: number;
};

export type Conversation = {
  id: string;
  title: string;
  /** UI label only — backend has no audience/context selection. */
  contextType: ContextType;
  messages: ConsultMessage[];
  status?: ConversationFilter | string;
  messageCount?: number;
  lastMessageAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  messagesLoaded?: boolean;
  /** Pagination cursor for older messages (preserve opaque value). */
  messagesNextCursor?: string | null;
  hasMoreMessages?: boolean;
};
