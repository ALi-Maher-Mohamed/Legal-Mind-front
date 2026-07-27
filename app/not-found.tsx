'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import { Button } from '@/components/ui';
import BrandMark from '@/components/common/BrandMark';
import AuthEntryLink from '@/components/common/AuthEntryLink';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(0,62,199,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_85%,rgba(214,158,46,0.14),transparent_50%)]" />
      <div className="pointer-events-none absolute start-1/4 top-1/4 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute end-1/5 bottom-1/5 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <BrandMark size="lg" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="mt-10 bg-gradient-to-l from-brand via-[#0038b6] to-accent bg-clip-text text-7xl font-bold tracking-tight text-transparent sm:text-8xl"
        >
          404
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-4 space-y-3"
        >
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t.common.notFoundTitle}
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted sm:text-base">
            {t.common.notFoundDesc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Link href={ROUTES.home} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto !rounded-xl">
              <span className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t.common.notFoundHome}
              </span>
            </Button>
          </Link>
          <AuthEntryLink className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto !rounded-xl">
              <span className="inline-flex items-center gap-2">
                {t.common.getStarted}
                <ArrowRight className="h-4 w-4 rotate-180" />
              </span>
            </Button>
          </AuthEntryLink>
        </motion.div>
      </div>
    </div>
  );
}
