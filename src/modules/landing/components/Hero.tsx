"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useThemeContext } from "@/lib/providers/ThemeProvider";
import { Button } from "@/components/ui";
import AuthEntryLink from "@/components/common/AuthEntryLink";
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
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-background pt-32 pb-20 md:min-h-[92vh] md:pt-40 md:pb-36">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={
              theme === "dark"
                ? "/images/hero-dark.png"
                : "/images/hero-light.png"
            }
            alt=""
            fill
            priority
            sizes="112vw"
            className="object-cover object-[center_12%] opacity-[0.42] transition-opacity duration-700 dark:opacity-[0.34]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/60 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,var(--lm-brand),transparent_55%)] opacity-10" />
      </div>

      <div className="lm-container relative z-10 w-full">
        {/* Text first in DOM → start side in LTR & RTL via document dir */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:max-w-[672px] flex flex-col gap-4 items-center lg:items-start text-center lg:text-start"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-[48px] lg:leading-[60px] font-bold tracking-tight text-foreground">
              {t.hero.arabicHeading}
            </h1>

            <p className="max-w-xl text-sm sm:text-base leading-[26px] text-muted opacity-90 lg:pt-2">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 w-full sm:w-auto sm:self-center lg:self-start">
              <AuthEntryLink className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {t.hero.ctaStart}
                </Button>
              </AuthEntryLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="w-full lg:max-w-[512px]"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {chips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={chip.title}
                    className="glass-panel flex items-center justify-start gap-2 rounded-lg px-3 py-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_10px_24px_-12px_rgba(15,23,42,0.28)] dark:hover:border-brand/35 dark:hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.45)]"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-brand" />
                    <span className="text-[11px] sm:text-xs font-bold tracking-wide text-foreground text-start">
                      {chip.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
