// src/modules/landing/components/Testimonials.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, SectionTitle } from '@/components/ui';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 't-1',
      name: t.testimonials.t1.name,
      role: t.testimonials.t1.role,
      text: t.testimonials.t1.text,
      avatar: 'SJ'
    },
    {
      id: 't-2',
      name: t.testimonials.t2.name,
      role: t.testimonials.t2.role,
      text: t.testimonials.t2.text,
      avatar: 'AM'
    },
    {
      id: 't-3',
      name: t.testimonials.t3.name,
      role: t.testimonials.t3.role,
      text: t.testimonials.t3.text,
      avatar: 'DC'
    }
  ];

  // Auto play
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden text-slate-100">
      {/* Background ambient light */}
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionTitle
          badge="آراء العملاء"
          title={t.testimonials.title}
          subtitle={t.testimonials.subtitle}
          align="center"
        />

        {/* Carousel Container */}
        <div className="relative min-h-75 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              <Card
                glowColor="rgba(59, 130, 246, 0.08)"
                className="p-8 md:p-12 border border-slate-800 bg-slate-900 flex flex-col items-center text-center gap-6"
              >
                {/* 5-Stars */}
                <div className="flex items-center gap-1 text-accent-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>

                {/* Feedback content */}
                <p className="text-base md:text-xl font-medium text-slate-300 leading-relaxed max-w-2xl">
                  &ldquo;{testimonials[activeIndex].text}&rdquo;
                </p>

                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(59,130,246,0.2)] select-none">
                    {testimonials[activeIndex].avatar}
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-sm font-semibold text-slate-100">
                      {testimonials[activeIndex].name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {testimonials[activeIndex].role}
                    </span>
                  </div>
                </div>

              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 -left-4 -right-4 flex items-center justify-between pointer-events-none">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer pointer-events-auto select-none active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer pointer-events-auto select-none active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel Indicators Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-350 cursor-pointer ${
                activeIndex === idx ? 'w-6 bg-blue-500' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
