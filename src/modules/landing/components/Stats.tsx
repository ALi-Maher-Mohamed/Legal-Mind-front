'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Counter } from '@/components/ui';

export default function Stats() {
  const { t } = useLanguage();

  const statItems = [
    { id: 'users', target: 10000, suffix: '+', label: t.stats.users },
    { id: 'consultations', target: 50000, suffix: '+', label: t.stats.consultations },
    { id: 'satisfaction', target: 98, suffix: '%', label: t.stats.satisfaction },
  ];

  return (
    <section className="border-y border-brand/10 bg-[#f0f4ff] py-12 md:py-16 dark:border-outline/30 dark:bg-surface-muted/50">
      <div className="lm-container">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 text-center">
          {statItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-4xl font-extrabold tracking-tight text-brand md:text-5xl select-none">
                <Counter target={item.target} suffix={item.suffix} duration={2200} />
              </div>
              <p className="text-xs sm:text-sm font-medium text-muted uppercase tracking-wider">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
