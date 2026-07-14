// src/components/ui/FAQItem.tsx
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
    <Card className="mb-4 overflow-hidden border border-white/5 hover:border-white/10" hoverGlow={false}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left md:p-6 cursor-pointer focus:outline-none select-none"
      >
        <span className="text-sm font-semibold text-gray-200 transition-colors duration-200 hover:text-white md:text-base text-right">
          {question}
        </span>
        <div className="ml-4 flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-all duration-200 group-hover:bg-white/10">
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-0 text-xs leading-relaxed text-gray-400 md:px-6 md:pb-6 md:text-sm border-t border-white/5 whitespace-pre-line text-right">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default FAQItem;
