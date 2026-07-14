'use client';

import { motion } from 'framer-motion';
import { Card, Counter } from '@/components/ui';

type StatCardProps = {
  target: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  glow: string;
  delay: number;
};

export default function StatCard({ target, suffix, label, icon, glow, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        glowColor={glow}
        className="p-8 border border-white/5 bg-[#181818]/40 hover:border-white/10 flex flex-col items-center justify-center text-center gap-4 transition-all"
      >
        <div className="p-3 bg-white/5 rounded-xl text-gray-300">{icon}</div>
        <div className="text-4xl font-extrabold tracking-tight text-white md:text-5xl mt-2 select-none">
          <Counter target={target} suffix={suffix} duration={2500} />
        </div>
        <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      </Card>
    </motion.div>
  );
}
