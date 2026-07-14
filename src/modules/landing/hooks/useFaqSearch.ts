'use client';

import { useState, useMemo } from 'react';

type FaqEntry = { id: string; question: string; answer: string };

export function useFaqSearch(faqData: FaqEntry[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = useMemo(
    () =>
      faqData.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [faqData, searchQuery],
  );

  return { searchQuery, setSearchQuery, filteredFaqs };
}
