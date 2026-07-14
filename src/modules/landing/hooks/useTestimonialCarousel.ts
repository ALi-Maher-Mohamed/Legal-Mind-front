'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTestimonialCarousel(total: number, intervalMs = 6000) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [total, intervalMs]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = useCallback((index: number) => setActiveIndex(index), []);

  return { activeIndex, handleNext, handlePrev, goTo };
}
