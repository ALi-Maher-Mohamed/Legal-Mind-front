'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import BrandMark from './BrandMark';

type Props = {
  label?: string;
  fullscreen?: boolean;
  className?: string;
};

export default function BrandSplash({
  label,
  fullscreen = true,
  className = '',
}: Props) {
  const { t } = useLanguage();
  const status = label ?? t.common.loadingBrand;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-background ${
        fullscreen ? 'min-h-screen' : 'min-h-[280px] w-full rounded-2xl'
      } ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,62,199,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(214,158,46,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute start-1/4 top-1/3 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute end-1/4 bottom-1/4 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.86, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, -8, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BrandMark size="xl" />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="text-sm font-medium tracking-wide text-muted"
        >
          {status}
        </motion.p>

        <div className="h-1 w-40 overflow-hidden rounded-full bg-brand/10 dark:bg-white/10">
          <motion.div
            className="h-full w-1/2 rounded-full bg-gradient-to-l from-brand via-brand-deep to-accent"
            animate={{ x: ['-120%', '220%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
}
