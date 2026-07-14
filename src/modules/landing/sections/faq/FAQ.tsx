'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionTitle } from '@/components/ui';
import { useFaqSearch } from '../../hooks/useFaqSearch';
import FAQSearch from './FAQSearch';
import FAQList from './FAQList';
import FAQCta from './FAQCta';

export default function FAQ() {
  const { t, isRtl } = useLanguage();

  const faqData = useMemo(
    () => [
      { id: 'faq-1', question: t.faq.q1, answer: t.faq.a1 },
      { id: 'faq-2', question: t.faq.q2, answer: t.faq.a2 },
      { id: 'faq-3', question: t.faq.q3, answer: t.faq.a3 },
      { id: 'faq-4', question: t.faq.q4, answer: t.faq.a4 },
    ],
    [t.faq],
  );

  const { searchQuery, setSearchQuery, filteredFaqs } = useFaqSearch(faqData);

  return (
    <section id="faq" className="py-24 bg-[#090909] relative scroll-mt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge={isRtl ? 'المساعدة والمعلومات' : 'Questions & Answers'}
          title={t.faq.title}
          subtitle={t.faq.subtitle}
          align="center"
        />
        <FAQSearch value={searchQuery} onChange={setSearchQuery} />
        <FAQList items={filteredFaqs} />
        <FAQCta />
      </div>
    </section>
  );
}
