export type ContextType = 'general' | 'firm' | 'case' | 'kb';

export type Citation = {
  id: string;
  sourceName: string;
  excerpt: string;
  page?: number;
};

export type ConsultMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: Citation[];
};

export type Conversation = {
  id: string;
  title: string;
  contextType: ContextType;
  messages: ConsultMessage[];
};
