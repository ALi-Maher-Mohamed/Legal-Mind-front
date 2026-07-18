'use client';

import React from 'react';
import { Message } from '@/types/chat.types';
import { Bot, User, FileText } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  isTyping?: boolean;
}

export function ChatBubble({ message, isTyping = false }: ChatBubbleProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`mb-4 flex w-full items-start gap-3.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
          isAssistant
            ? 'border border-outline/40 bg-surface-raised text-foreground'
            : 'bg-brand text-on-brand shadow-[0_4px_12px_rgba(0,62,199,0.2)]'
        }`}
      >
        {!isAssistant && message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 flex flex-col gap-1">
            {message.attachments.map((file, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs"
              >
                <FileText className="h-3 w-3" />
                <span className="max-w-[150px] truncate font-medium">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        {isTyping ? (
          <div className="flex items-center gap-1 py-1.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <div className="whitespace-pre-line text-xs sm:text-sm">{message.content}</div>
        )}

        {!isTyping && message.timestamp && (
          <div className={`mt-1.5 text-[9px] text-end ${isAssistant ? 'text-muted' : 'opacity-70'}`}>
            {message.timestamp}
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-outline/40 bg-surface-raised text-muted">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

export default ChatBubble;
