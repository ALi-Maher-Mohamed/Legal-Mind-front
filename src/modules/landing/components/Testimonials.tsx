// src/modules/landing/components/Testimonials.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, SectionTitle } from '@/components/ui';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const { t, isRtl } = useLanguage();
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
    <section className="py-24 bg-[#090909] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionTitle
          badge={isRtl ? "آراء العملاء" : "Testimonials"}
          title={t.testimonials.title}
          subtitle={t.testimonials.subtitle}
          align="center"
        />

        {/* Carousel Container */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRtl ? 50 : -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              <Card
                glowColor="rgba(59, 130, 246, 0.2)"
                className="p-8 md:p-12 border border-white/5 bg-[#181818]/60 flex flex-col items-center text-center gap-6"
              >
                {/* 5-Stars */}
                <div className="flex items-center gap-1 text-[#F6C453]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>

                {/* Feedback content */}
                <p className="text-base md:text-xl font-medium text-gray-200 leading-relaxed max-w-2xl">
                  &ldquo;{testimonials[activeIndex].text}&rdquo;
                </p>

                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(59,130,246,0.2)] select-none">
                    {testimonials[activeIndex].avatar}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-white">
                      {testimonials[activeIndex].name}
                    </span>
                    <span className="text-xs text-gray-500">
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
              className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer pointer-events-auto select-none active:scale-95"
            >
              {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer pointer-events-auto select-none active:scale-95"
            >
              {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
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
