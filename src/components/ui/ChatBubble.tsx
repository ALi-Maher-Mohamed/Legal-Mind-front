// src/components/ui/ChatBubble.tsx
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
    <div className={`flex w-full items-start gap-3.5 mb-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {/* Bot Icon */}
      {isAssistant && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
          <Bot className="h-4 w-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isAssistant
          ? 'bg-slate-100 border border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100'
          : 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)]'
      }`}>
        {/* Attachment Pill (if any) */}
        {!isAssistant && message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 flex flex-col gap-1">
            {message.attachments.map((file, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700 border border-slate-200"
              >
                <FileText className="h-3 w-3" />
                <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                <span className="text-[10px] opacity-70">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {isTyping ? (
          <div className="flex items-center gap-1 py-1.5 px-0.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <div className="whitespace-pre-line text-xs sm:text-sm prose max-w-none text-inherit">
            {message.content}
          </div>
        )}

        {/* Timestamp */}
        {!isTyping && (
          <div className={`mt-1.5 text-[9px] ${isAssistant ? 'text-slate-500' : 'text-blue-600'} text-end`}>
            {message.timestamp}
          </div>
        )}
      </div>

      {/* User Icon */}
      {!isAssistant && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

export default ChatBubble;