'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionTitle, ChatBubble } from '@/components/ui';
import { Message, Attachment } from '@/types/chat.types';
import { chatService } from '@/services/chat.service';
import { Send, Paperclip, FileText, X } from 'lucide-react';

export default function AIAssistantPreview() {
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length === 0 && !isTyping) return;
    const container = messagesEndRef.current?.parentElement;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend = inputValue, overrideAttachments = attachedFiles) => {
    const text = textToSend.trim();
    if (!text && overrideAttachments.length === 0) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text || 'مستند مرفق للتحليل',
      timestamp: new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      attachments: overrideAttachments,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setAttachedFiles([]);
    setIsTyping(true);

    try {
      const reply = await chatService.sendMessage(text, overrideAttachments);
      setIsTyping(false);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setIsTyping(false);
      console.error(err);
    }
  };

  const handleSuggestion = (key: 'lease' | 'developer') => {
    if (key === 'lease') {
      handleSend('حلل عقد الإيجار المرفق', [
        { name: 'lease_agreement_draft.pdf', size: 126900, type: 'application/pdf' },
      ]);
      return;
    }
    handleSend('صياغة عقد عمل لمطور برمجيات مستقل', []);
  };

  return (
    <section className="bg-[#f0f4ff] py-16 md:py-20 dark:bg-surface-muted">
      <div className="lm-container max-w-[1152px]">
        <SectionTitle badge="AI SIMULATOR" title={t.aiPreview.title} align="center" />

        <div className="overflow-hidden rounded-2xl border border-outline bg-white shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] dark:border-brand/20 dark:bg-[rgba(23,31,51,0.75)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] dark:backdrop-blur-[6px]">
          {/* Window chrome stays LTR like OS windows */}
          <div
            dir="ltr"
            className="flex items-center justify-between border-b border-outline/40 bg-surface-raised px-4 py-4 sm:px-6 dark:bg-surface-raised"
          >
            <div className="flex gap-2">
              <span className="size-3 rounded-full bg-danger" />
              <span className="size-3 rounded-full bg-accent" />
              <span className="size-3 rounded-full bg-brand" />
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-end sm:block" dir="rtl">
                <p className="text-xs font-bold tracking-wide text-foreground">{t.aiPreview.chatHeader}</p>
                <p className="text-[10px] text-brand">{t.aiPreview.onlineStatus}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <svg className="h-5 w-5" viewBox="0 0 100 100" fill="none" aria-hidden>
                  <path d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z" stroke="currentColor" strokeWidth="8" />
                </svg>
              </div>
            </div>
          </div>

          {/* Messages — inherit page direction */}
          <div className="min-h-[320px] max-h-[420px] overflow-y-auto space-y-4 bg-white p-4 sm:p-6 dark:bg-background">
            <AnimatePresence initial={false}>
              {[
                {
                  id: 'msg-welcome',
                  role: 'assistant' as const,
                  content: t.aiPreview.welcomeMessage,
                  timestamp: new Date().toLocaleTimeString('ar-EG', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                },
                ...messages,
              ].map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatBubble message={msg} />
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <ChatBubble
                isTyping
                message={{ id: 'typing', role: 'assistant', content: '', timestamp: '' }}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 border-t border-outline/20 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => handleSuggestion('lease')}
              className="rounded-xl border border-outline px-3 py-1 text-[11px] text-muted hover:border-brand hover:text-brand transition"
            >
              {t.aiPreview.promptOne}
            </button>
            <button
              type="button"
              onClick={() => handleSuggestion('developer')}
              className="rounded-xl border border-outline px-3 py-1 text-[11px] text-muted hover:border-brand hover:text-brand transition"
            >
              {t.aiPreview.promptTwo}
            </button>
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 border-t border-outline/40 bg-surface-raised px-4 py-3 sm:px-6 dark:bg-surface-raised">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted hover:text-brand transition"
              aria-label="Attach"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAttachedFiles([{ name: file.name, size: file.size, type: file.type }]);
              }}
            />
            <div className="flex-1">
              {attachedFiles[0] && (
                <div className="mb-1 inline-flex items-center gap-1 rounded bg-brand/10 px-2 py-0.5 text-[10px] text-brand">
                  <FileText className="h-3 w-3" />
                  <span className="max-w-[120px] truncate">{attachedFiles[0].name}</span>
                  <button type="button" onClick={() => setAttachedFiles([])}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب سؤالك القانوني..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none text-start"
                dir="rtl"
              />
            </div>
            <button
              type="button"
              onClick={() => handleSend()}
              className="flex size-10 items-center justify-center rounded bg-brand text-on-brand shadow-sm hover:brightness-110 transition"
              aria-label={t.common.send}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
