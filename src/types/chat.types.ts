// src/types/chat.types.ts

export interface Attachment {
  name: string;
  size: number;
  type: string;
  content?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string or formatted string
  attachments?: Attachment[];
}

export interface ChatSession {
  id: string;
  messages: Message[];
  title?: string;
  createdAt: string;
}
