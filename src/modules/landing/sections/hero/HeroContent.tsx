'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui';

export default function HeroContent() {
  const { t } = useLanguage();

  return (
    <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-start gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-semibold uppercase tracking-wider"
      >
        <span>تكنولوجيا المستقبل القانونية</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-[#F6C453] block mb-2">
          {t.hero.arabicHeading}
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-xl"
      >
        {t.hero.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <Button variant="primary" size="lg" className="w-full sm:w-auto">{t.hero.ctaStart}</Button>
        <Button variant="secondary" size="lg" className="w-full sm:w-auto">{t.hero.ctaDemo}</Button>
      </motion.div>
    </div>
  );
}
