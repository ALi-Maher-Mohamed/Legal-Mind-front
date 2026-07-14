// src/modules/landing/components/FAQ.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button, Card, SectionTitle, FAQItem } from '@/components/ui';
import { Search, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const { t, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      id: 'faq-1',
      question: t.faq.q1,
      answer: t.faq.a1
    },
    {
      id: 'faq-2',
      question: t.faq.q2,
      answer: t.faq.a2
    },
    {
      id: 'faq-3',
      question: t.faq.q3,
      answer: t.faq.a3
    },
    {
      id: 'faq-4',
      question: t.faq.q4,
      answer: t.faq.a4
    }
  ];

  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToChat = () => {
    const chatSection = document.querySelector('input[type="text"]');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (chatSection as HTMLInputElement).focus();
    } else {
      window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
    }
  };

  return (
    <section id="faq" className="py-24 bg-[#090909] relative scroll-mt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionTitle
          badge={isRtl ? "المساعدة والمعلومات" : "Questions & Answers"}
          title={t.faq.title}
          subtitle={t.faq.subtitle}
          align="center"
        />

        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16 min-h-[100px]">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
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
                    ? "لم نعثر على نتائج مطابقة لبحثك. يرجى تجربة كلمات أخرى."
                    : "No matching questions found. Try searching for other terms."}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card
            glowColor="rgba(246, 196, 83, 0.15)"
            className="p-8 border border-white/5 bg-gradient-to-br from-[#181818] to-[#131313] hover:border-white/10 text-center flex flex-col items-center gap-4 relative overflow-hidden"
          >
            {/* Soft gold backdrop decoration */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#F6C453]/5 blur-xl rounded-full" />
            
            <h3 className="text-lg font-bold text-white md:text-xl relative z-10">
              {t.faq.ctaTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed relative z-10">
              {t.faq.ctaDesc}
            </p>
            <Button variant="gold" size="md" className="relative z-10" onClick={scrollToChat}>
              {t.faq.ctaBtn}
            </Button>
          </Card>
        </motion.div>

      </div>
    </section>
  );
}
