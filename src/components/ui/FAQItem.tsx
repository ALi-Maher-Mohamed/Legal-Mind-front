'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-brand/15 bg-white shadow-[0_2px_8px_rgba(0,62,199,0.06)] dark:border-white/10 dark:bg-[rgba(23,31,51,0.85)] dark:shadow-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-5 text-start md:p-6 cursor-pointer focus:outline-none select-none hover:bg-[#f0f4ff]/60 dark:hover:bg-white/5 transition-colors"
      >
        <span className="text-sm font-semibold text-[#191c1e] md:text-base dark:text-[#dae2fd]">
          {question}
        </span>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
            isOpen
              ? 'bg-brand text-on-brand'
              : 'bg-brand/10 text-brand dark:bg-white/5 dark:text-[#c4c6cf]'
          }`}
        >
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
            <div className="border-t border-brand/10 px-5 pb-5 pt-4 text-xs leading-relaxed text-[#434656] md:px-6 md:pb-6 md:text-sm whitespace-pre-line dark:border-white/10 dark:text-[#c4c6cf]">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FAQItem;
