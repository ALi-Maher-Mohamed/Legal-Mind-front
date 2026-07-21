"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useThemeContext } from "@/lib/providers/ThemeProvider";
import { Button } from "@/components/ui";
import { ROUTES } from "@/config/routes";
import { Shield, FileText, Scale, Activity } from "lucide-react";

export default function Hero() {
  const { t } = useLanguage();
  const { theme } = useThemeContext();

  const chips = [
    { title: t.hero.features.analyzeDocs, icon: Shield },
    { title: t.hero.features.generateContracts, icon: FileText },
    { title: t.hero.features.legalConsultation, icon: Scale },
    { title: t.hero.features.caseTracking, icon: Activity },
  ];

  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_30%_20%,var(--lm-brand),transparent_55%)]" />

      <div className="lm-container relative z-10">
        {/* Text first in DOM → start side in LTR & RTL via document dir */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:max-w-[672px] flex flex-col gap-4 items-center lg:items-start text-center lg:text-start"
          >
            <span className="inline-flex self-center lg:self-start rounded-xl border border-brand/30 bg-brand/5 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-brand uppercase">
              تكنولوجيا المستقبل القانونية
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[48px] lg:leading-[60px] font-bold tracking-tight text-foreground">
              {t.hero.arabicHeading}
            </h1>

            <p className="max-w-xl text-sm sm:text-base leading-[26px] text-muted opacity-90 lg:pt-2">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 w-full sm:w-auto sm:self-center lg:self-start">
              <Link href={ROUTES.login} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {t.hero.ctaStart}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="w-full lg:max-w-[512px] flex flex-col gap-6"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {chips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={chip.title}
                    className="glass-panel flex items-center justify-start gap-2 rounded-lg px-3 py-3.5"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-brand" />
                    <span className="text-[11px] sm:text-xs font-bold tracking-wide text-foreground text-start">
                      {chip.title}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-2xl border border-outline bg-white shadow-xl dark:bg-surface dark:border-outline/40">
              <Image
                src={
                  theme === "dark"
                    ? "/images/hero-dark.png"
                    : "/images/hero-light.png"
                }
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 512px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-60" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
