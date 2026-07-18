'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button, Card, SectionTitle, FAQItem } from '@/components/ui';
import { Search, HelpCircle } from 'lucide-react';
import { scrollToChat } from '../lib/scrollToChat';

export default function FAQ() {
  const { t, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    { id: 'faq-1', question: t.faq.q1, answer: t.faq.a1 },
    { id: 'faq-2', question: t.faq.q2, answer: t.faq.a2 },
    { id: 'faq-3', question: t.faq.q3, answer: t.faq.a3 },
    { id: 'faq-4', question: t.faq.q4, answer: t.faq.a4 },
  ];

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section id="faq" className="relative scroll-mt-20 bg-surface-muted/40 py-16 md:py-20">
      <div className="lm-container max-w-4xl relative z-10">
        <SectionTitle badge="FAQ" title={t.faq.title} subtitle={t.faq.subtitle} align="center" />

        <div className="relative mx-auto mb-8 max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="w-full rounded-lg border border-outline bg-card py-3 ps-10 pe-4 text-xs sm:text-sm text-foreground text-start placeholder:text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </div>

        <div className="mb-12 min-h-20 space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  layout
                >
                  <FAQItem question={faq.question} answer={faq.answer} />
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted">
                <HelpCircle className="h-8 w-8" />
                <span>
                  {isRtl
                    ? 'لم نعثر على نتائج مطابقة لبحثك. يرجى تجربة كلمات أخرى.'
                    : 'No matching questions found. Try searching for other terms.'}
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>

        <Card className="flex flex-col items-center gap-4 p-6 sm:p-8 text-center">
          <h3 className="text-lg font-bold text-foreground md:text-xl">{t.faq.ctaTitle}</h3>
          <p className="max-w-lg text-xs sm:text-sm leading-relaxed text-muted">{t.faq.ctaDesc}</p>
          <Button variant="primary" size="md" onClick={scrollToChat}>
            {t.faq.ctaBtn}
          </Button>
        </Card>
      </div>
    </section>
  );
}
