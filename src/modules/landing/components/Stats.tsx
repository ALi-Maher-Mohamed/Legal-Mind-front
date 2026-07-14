// src/modules/landing/components/Stats.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, Counter } from '@/components/ui';
import { Users, FileCheck, Award } from 'lucide-react';

export default function Stats() {
  const { t } = useLanguage();

  const statItems = [
    {
      id: 'users',
      target: 10000,
      suffix: '+',
      label: t.stats.users,
      icon: <Users className="h-6 w-6 text-blue-400 animate-pulse" />,
      glow: "rgba(59, 130, 246, 0.15)"
    },
    {
      id: 'consultations',
      target: 50000,
      suffix: '+',
      label: t.stats.consultations,
      icon: <FileCheck className="h-6 w-6 text-purple-400" />,
      glow: "rgba(139, 92, 246, 0.15)"
    },
    {
      id: 'satisfaction',
      target: 98,
      suffix: '%',
      label: t.stats.satisfaction,
      icon: <Award className="h-6 w-6 text-[#F6C453]" />,
      glow: "rgba(246, 196, 83, 0.15)"
    }
  ];

  return (
    <section className="py-16 bg-[#090909] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {statItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card
                glowColor={item.glow}
                className="p-8 border border-white/5 bg-[#181818]/40 hover:border-white/10 flex flex-col items-center justify-center text-center gap-4 transition-all"
              >
                {/* Icon Container */}
                <div className="p-3 bg-white/5 rounded-xl text-gray-300">
                  {item.icon}
                </div>

                {/* Counter */}
                <div className="text-4xl font-extrabold tracking-tight text-white md:text-5xl mt-2 select-none">
                  <Counter target={item.target} suffix={item.suffix} duration={2500} />
                </div>

                {/* Label */}
                <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
