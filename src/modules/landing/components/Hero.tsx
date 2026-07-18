// src/modules/landing/components/Hero.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button, Card } from '@/components/ui';
import { Shield, FileText, Cpu, Search, HelpCircle, Activity } from 'lucide-react';

export default function Hero() {
  const { t, isRtl } = useLanguage();

  const floatingFeatures = [
    { title: t.hero.features.analyzeDocs, icon: <Shield className="h-5 w-5 text-blue-400" />, delay: 0, hoverGlow: "rgba(59, 130, 246, 0.2)" },
    { title: t.hero.features.generateContracts, icon: <FileText className="h-5 w-5 text-purple-400" />, delay: 0.2, hoverGlow: "rgba(139, 92, 246, 0.2)" },
    { title: t.hero.features.legalConsultation, icon: <Cpu className="h-5 w-5 text-emerald-400" />, delay: 0.4, hoverGlow: "rgba(16, 185, 129, 0.2)" },
    { title: t.hero.features.govGuide, icon: <Search className="h-5 w-5 text-accent-gold" />, delay: 0.1, hoverGlow: "rgba(246, 196, 83, 0.2)" },
    { title: t.hero.features.explainTerms, icon: <HelpCircle className="h-5 w-5 text-pink-400" />, delay: 0.3, hoverGlow: "rgba(244, 63, 94, 0.2)" },
    { title: t.hero.features.caseTracking, icon: <Activity className="h-5 w-5 text-orange-400" />, delay: 0.5, hoverGlow: "rgba(249, 115, 22, 0.2)" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-950 text-slate-100">
      {/* Glowing Radial Background Blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-87.5 sm:w-125 h-87.5 sm:h-125 rounded-full bg-blue-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-87.5 sm:w-125 h-87.5 sm:h-125 rounded-full bg-purple-500/20 blur-[100px] pointer-events-none" />

      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-start gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-semibold uppercase tracking-wider"
            >
              <span>{isRtl ? "تكنولوجيا المستقبل القانونية" : "Next-Gen Legal Technology"}</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
            >
              {isRtl ? (
                <>
                  <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-accent-gold block mb-2">
                    {t.hero.arabicHeading}
                  </span>
                </>
              ) : (
                <>
                  {t.hero.titlePrefix}
                  <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                    {t.hero.titleHighlight}
                  </span>
                  {t.hero.titleSuffix}
                </>
              )}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl"
            >
              {t.hero.description}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                {t.hero.ctaStart}
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                {t.hero.ctaDemo}
              </Button>
            </motion.div>
          </div>

          {/* Hero Right: Floating feature cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative">
            {/* Center Background Light for the Cards */}
            <div className="absolute inset-0 m-auto w-48 h-48 rounded-full bg-blue-500/20 blur-[60px] pointer-events-none" />

            {floatingFeatures.map((feat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feat.delay }}
              >
                {/* Floating Y-Axis micro-animation */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: feat.delay
                  }}
                >
                  <Card
                    glowColor={feat.hoverGlow}
                    className="p-5 flex items-center gap-4 border border-slate-800 bg-slate-900 shadow-sm group transition-all"
                  >
                    <div className="p-3 bg-slate-800 rounded-xl text-slate-100 group-hover:scale-110 group-hover:bg-slate-700 transition-all duration-300">
                      {feat.icon}
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-slate-200 transition duration-200">
                      {feat.title}
                    </span>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
