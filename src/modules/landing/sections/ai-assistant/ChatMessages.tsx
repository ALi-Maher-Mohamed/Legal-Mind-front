'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubble } from '@/components/ui';
import { Message } from '@/types/chat.types';

type ChatMessagesProps = {
  welcomeMessage: string;
  welcomeTimestamp: string;
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export default function ChatMessages({
  welcomeMessage,
  welcomeTimestamp,
  messages,
  isTyping,
  messagesEndRef,
}: ChatMessagesProps) {
  const allMessages: Message[] = [
    { id: 'msg-welcome', role: 'assistant', content: welcomeMessage, timestamp: welcomeTimestamp },
    ...messages,
  ];

  return (
    <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-white/10 space-y-4">
      <AnimatePresence initial={false}>
        {allMessages.map((msg) => (
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
          <ChatBubble message={{ id: 'typing', role: 'assistant', content: '', timestamp: '' }} isTyping />
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
