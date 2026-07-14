// src/components/ui/Counter.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCounter } from '@/hooks/useCounter';

interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function Counter({
  target,
  duration = 2000,
  suffix = '',
  className = ''
}: CounterProps) {
  const [startCount, setStartCount] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const count = useCounter(startCount ? target : 0, duration);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={elementRef} className={className}>
      {count}
      {suffix}
    </span>
  );
}

export default Counter;
