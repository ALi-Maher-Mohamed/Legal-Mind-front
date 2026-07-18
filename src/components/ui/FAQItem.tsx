'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Card from './Card';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-3 overflow-hidden border-outline/50" hoverGlow={false}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-5 text-start md:p-6 cursor-pointer focus:outline-none select-none"
      >
        <span className="text-sm font-semibold text-foreground md:text-base">{question}</span>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface-raised text-muted">
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="border-t border-outline/40 px-5 pb-5 pt-4 text-xs leading-relaxed text-muted md:px-6 md:pb-6 md:text-sm whitespace-pre-line">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default FAQItem;
