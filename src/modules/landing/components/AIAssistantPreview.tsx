"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { Button, Card, SectionTitle, ChatBubble } from "@/components/ui";
import { Message, Attachment } from "@/types/chat.types";
import { chatService } from "@/services/chat.service";
import { Send, Paperclip, FileText, X } from "lucide-react";
import { useThemeContext } from "@/lib/providers/ThemeProvider";

export default function AIAssistantPreview() {
  const { theme } = useThemeContext();
  const { t, locale, isRtl } = useLanguage();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // State for simulated chat
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (
    textToSend = inputValue,
    overrideAttachments = attachedFiles,
  ) => {
    const text = textToSend.trim();
    if (!text && overrideAttachments.length === 0) return;

    // Construct User Message
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content:
        text ||
        (isRtl ? "مستند مرفق للتحليل" : "Uploaded document for analysis"),
      timestamp: new Date().toLocaleTimeString(
        locale === "ar" ? "ar-EG" : "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
      attachments: overrideAttachments,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setAttachedFiles([]);
    setIsTyping(true);

    try {
      // Call Mock Service
      const reply = await chatService.sendMessage(
        text,
        locale,
        overrideAttachments,
      );
      setIsTyping(false);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setIsTyping(false);
      console.error(err);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simulate file upload trigger
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockAttachment: Attachment = {
        name: file.name,
        size: file.size,
        type: file.type,
      };
      setAttachedFiles([mockAttachment]);
    }
  };

  const removeAttachment = () => {
    setAttachedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Suggestion chips handler
  const handleSuggestionClick = (promptKey: "lease" | "developer") => {
    if (promptKey === "lease") {
      const text =
        locale === "ar"
          ? "حلل عقد الإيجار المرفق"
          : "Analyze this commercial lease contract.";
      const mockAttachment: Attachment = {
        name: "lease_agreement_draft.pdf",
        size: 126900,
        type: "application/pdf",
      };
      handleSend(text, [mockAttachment]);
    } else {
      const text =
        locale === "ar"
          ? "صياغة عقد عمل لمطور برمجيات مستقل"
          : "Draft a freelance software developer agreement.";
      handleSend(text, []);
    }
  };

  return (
    <section className="py-20 bg-slate-950 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Details Panel */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-right gap-6">
            <SectionTitle
              badge={t.aiPreview.badge}
              title={t.aiPreview.title}
              subtitle={t.aiPreview.description}
              align={isRtl ? "right" : "left"}
              className="mb-0!"
            />
            <Button variant="primary" size="lg">
              {t.aiPreview.ctaText}
            </Button>
          </div>

          {/* Right Simulated Chat Interface */}
          <div className="lg:col-span-7 w-full">
            <Card
              glowColor="rgba(59, 130, 246, 0.15)"
              className="border border-slate-800 shadow-sm overflow-hidden h-[480px] flex flex-col bg-slate-900"
            >
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-8.5 w-8.5 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                      <svg
                        className="h-4.5 w-4.5"
                        viewBox="0 0 100 100"
                        fill="none"
                      >
                        <path
                          d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z"
                          stroke="currentColor"
                          strokeWidth="8"
                        />
                      </svg>
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-black animate-pulse" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-white">
                      {t.aiPreview.chatHeader}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {t.aiPreview.onlineStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto max-h-[320px] p-5 scrollbar-thin scrollbar-thumb-white/10 space-y-4"
              >
                <AnimatePresence initial={false}>
                  {[
                    {
                      id: "msg-welcome",
                      role: "assistant" as const,
                      content: t.aiPreview.welcomeMessage,
                      timestamp: new Date().toLocaleTimeString(
                        locale === "ar" ? "ar-EG" : "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      ),
                    },
                    ...messages,
                  ].map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChatBubble message={msg} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card role="status">
                      <ChatBubble
                        message={{
                          id: "typing",
                          role: "assistant",
                          content: "",
                          timestamp: "",
                        }}
                        isTyping={true}
                      />
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Suggestion Prompt Chips */}
              {messages.length === 0 && !isTyping && (
                <div className="px-5 pb-3 flex flex-wrap gap-2 justify-end">
                  <button
                    type="button"
                    style={{ color: theme === "light" ? "black" : "" }}
                    onClick={() => handleSuggestionClick("lease")}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition cursor-pointer select-none"
                  >
                    {t.aiPreview.promptOne}
                  </button>
                  <button
                    type="button"
                    style={{ color: theme === "light" ? "black" : "" }}
                    onClick={() => handleSuggestionClick("developer")}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-200 hover:bg-slate-700 hover:border-slate-600 transition cursor-pointer select-none"
                  >
                    {t.aiPreview.promptTwo}
                  </button>
                </div>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />

              {/* Attached file status indicators */}
              {attachedFiles.length > 0 && (
                <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <FileText className="h-4 w-4 text-slate-300" />
                    <span className="truncate max-w-50">
                      {attachedFiles[0].name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ({(attachedFiles[0].size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-100 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Input Panel */}
              <form
                onSubmit={onSubmit}
                className="px-5 py-4 border-t border-slate-800 bg-slate-950 flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={triggerFileUpload}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 hover:bg-slate-800 hover:border-slate-700 transition cursor-pointer"
                  title={t.common.uploadFile}
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    attachedFiles.length > 0
                      ? t.aiPreview.uploadSuccess
                      : isRtl
                        ? "اطرح سؤالك أو اكتب رسالتك هنا..."
                        : "Type a message or legal question..."
                  }
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)] transition cursor-pointer active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
