'use client';

import { useState, useCallback } from 'react';
import { ONBOARDING_SLIDES } from '../data/onboarding.data';

export function useOnboarding(onComplete: () => void) {
  const [slide, setSlide] = useState(0);
  const total = ONBOARDING_SLIDES.length;
  const isLast = slide === total - 1;

  const next = useCallback(() => {
    if (isLast) {
      onComplete();
      return;
    }
    setSlide((prev) => Math.min(total - 1, prev + 1));
  }, [isLast, onComplete, total]);

  const prev = useCallback(() => {
    setSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const skip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return { slide, setSlide, total, isLast, next, prev, skip, slides: ONBOARDING_SLIDES };
}
