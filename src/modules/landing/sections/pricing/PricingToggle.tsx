'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

type PricingToggleProps = {
  isYearly: boolean;
  onToggle: () => void;
};

export default function PricingToggle({ isYearly, onToggle }: PricingToggleProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center gap-4 mb-16 select-none">
      <span className={`text-xs sm:text-sm font-medium ${!isYearly ? 'text-white' : 'text-gray-500'} transition`}>
        {t.common.monthly}
      </span>
      <button
        onClick={onToggle}
        className="relative h-6 w-11 rounded-full bg-white/10 hover:bg-white/15 border border-white/5 transition duration-300 focus:outline-none cursor-pointer"
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-blue-500 ${isYearly ? 'right-0.5' : 'left-0.5'}`}
        />
      </button>
      <span className={`text-xs sm:text-sm font-medium flex items-center gap-1.5 ${isYearly ? 'text-white' : 'text-gray-500'} transition`}>
        <span>{t.common.yearly}</span>
        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
          {t.common.save20}
        </span>
      </span>
    </div>
  );
}
