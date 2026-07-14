'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { FAQItem } from '@/components/ui';
import { useLanguage } from '@/hooks/useLanguage';

type FaqEntry = { id: string; question: string; answer: string };

type FAQListProps = {
  items: FaqEntry[];
};

export default function FAQList({ items }: FAQListProps) {
  const { isRtl } = useLanguage();

  return (
    <div className="space-y-4 mb-16 min-h-[100px]">
      <AnimatePresence mode="popLayout">
        {items.length > 0 ? (
          items.map((faq, idx) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              layout
            >
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 text-gray-500 text-sm flex flex-col items-center justify-center gap-2"
          >
            <HelpCircle className="h-8 w-8 text-gray-600 animate-bounce" />
            <span>
              {isRtl
                ? 'لم نعثر على نتائج مطابقة لبحثك. يرجى تجربة كلمات أخرى.'
                : 'No matching questions found. Try searching for other terms.'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
