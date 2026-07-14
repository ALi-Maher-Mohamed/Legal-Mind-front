'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui';
import { HERO_FEATURES } from '../../data/hero.data';

export default function HeroFloatingCards() {
  const { t } = useLanguage();

  return (
    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative">
      <div className="absolute inset-0 m-auto w-48 h-48 rounded-full bg-blue-500/20 blur-[60px] pointer-events-none" />

      {HERO_FEATURES.map((feat, index) => {
        const Icon = feat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: feat.delay }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: feat.delay }}
            >
              <Card
                glowColor={feat.hoverGlow}
                className="p-5 flex items-center gap-4 border border-white/5 bg-[#181818]/45 hover:border-white/10 group transition-all"
              >
                <div className="p-3 bg-white/5 rounded-xl text-gray-300 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                  <Icon className={`h-5 w-5 ${feat.iconClass}`} />
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-200 group-hover:text-white transition duration-200">
                  {t.hero.features[feat.titleKey]}
                </span>
              </Card>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
