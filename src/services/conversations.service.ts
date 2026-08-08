import { api } from '@/lib/api/client';
import type {
  ApiConversation,
  ApiMessage,
  ListConversationsResponse,
  ListMessagesResponse,
  SendMessageResponse,
} from '@/types/conversation.api';

export type ListConversationsParams = {
  cursor?: string;
  limit?: number;
  status?: 'active' | 'archived';
};

export type ListMessagesParams = {
  cursor?: string;
  limit?: number;
};

export type SendMessagePayload = {
  content: string;
  idempotency_key: string;
  top_k?: number;
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    query.set(key, String(value));
  }
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const conversationsService = {
  async create(title?: string): Promise<ApiConversation> {
    return api.post<ApiConversation>(
      '/api/v1/conversations',
      { json: title?.trim() ? { title: title.trim() } : {} },
      { auth: true },
    );
  },

  async list(params: ListConversationsParams = {}): Promise<ListConversationsResponse> {
    const response = await api.get<ListConversationsResponse>(
      `/api/v1/conversations${buildQuery({
        cursor: params.cursor,
        limit: params.limit ?? 20,
        status: params.status ?? 'active',
      })}`,
      { auth: true },
    );
    return {
      conversations: response?.conversations ?? [],
      next_cursor: response?.next_cursor ?? null,
    };
  },

  async get(conversationId: string): Promise<ApiConversation> {
    return api.get<ApiConversation>(`/api/v1/conversations/${conversationId}`, {
      auth: true,
    });
  },

  async listMessages(
    conversationId: string,
    params: ListMessagesParams = {},
  ): Promise<ListMessagesResponse> {
    const response = await api.get<ListMessagesResponse>(
      `/api/v1/conversations/${conversationId}/messages${buildQuery({
        cursor: params.cursor,
        limit: params.limit ?? 50,
      })}`,
      { auth: true },
    );
    return {
      messages: response?.messages ?? [],
      next_cursor: response?.next_cursor ?? null,
    };
  },

  async sendMessage(
    conversationId: string,
    payload: SendMessagePayload,
  ): Promise<SendMessageResponse> {
    return api.post<SendMessageResponse>(
      `/api/v1/conversations/${conversationId}/messages`,
      {
        json: {
          content: payload.content.trim(),
          idempotency_key: payload.idempotency_key,
          top_k: payload.top_k ?? 5,
        },
      },
      { auth: true },
    );
  },

  async update(
    conversationId: string,
    body: { title?: string; status?: 'active' | 'archived' },
  ): Promise<ApiConversation> {
    return api.patch<ApiConversation>(
      `/api/v1/conversations/${conversationId}`,
      { json: body },
      { auth: true },
    );
  },

  async remove(conversationId: string): Promise<void> {
    await api.delete(`/api/v1/conversations/${conversationId}`, { auth: true });
  },
};

/** Prefer crypto.randomUUID; fallback keeps UUID shape for backend Zod. */
export function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

export type { ApiConversation, ApiMessage };
