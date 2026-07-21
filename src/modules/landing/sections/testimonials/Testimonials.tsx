'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionTitle } from '@/components/ui';
import { TESTIMONIALS } from '../../data/testimonials.data';
import { useTestimonialCarousel } from '../../hooks/useTestimonialCarousel';
import TestimonialSlide from './TestimonialSlide';
import TestimonialNav from './TestimonialNav';
import TestimonialDots from './TestimonialDots';

export default function Testimonials() {
  const { t } = useLanguage();
  const { activeIndex, handleNext, handlePrev, goTo } = useTestimonialCarousel(TESTIMONIALS.length);

  const items = useMemo(
    () =>
      TESTIMONIALS.map((item) => ({
        ...item,
        name: t.testimonials[item.key].name,
        role: t.testimonials[item.key].role,
        text: t.testimonials[item.key].text,
      })),
    [t.testimonials],
  );

  const active = items[activeIndex];

  return (
    <section className="py-24 bg-[#090909] relative overflow-hidden">
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge="آراء العملاء"
          title={t.testimonials.title}
          subtitle={t.testimonials.subtitle}
          align="center"
        />
        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full"
            >
              <TestimonialSlide
                text={active.text}
                name={active.name}
                role={active.role}
                avatar={active.avatar}
              />
            </motion.div>
          </AnimatePresence>
          <TestimonialNav onPrev={handlePrev} onNext={handleNext} />
        </div>
        <TestimonialDots total={items.length} activeIndex={activeIndex} onSelect={goTo} />
      </div>
    </section>
  );
}
