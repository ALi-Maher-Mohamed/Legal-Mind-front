// src/modules/landing/components/ServicesList.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, SectionTitle } from '@/components/ui';
import { Shield, FileText, Cpu, Search, HelpCircle, Activity } from 'lucide-react';

export default function ServicesList() {
  const { t, isRtl } = useLanguage();

  const services = [
    {
      title: t.services.docAnalysis.title,
      desc: t.services.docAnalysis.desc,
      icon: <Shield className="h-6 w-6 text-blue-400" />,
      glow: "rgba(59, 130, 246, 0.18)"
    },
    {
      title: t.services.contractGen.title,
      desc: t.services.contractGen.desc,
      icon: <FileText className="h-6 w-6 text-purple-400" />,
      glow: "rgba(139, 92, 246, 0.18)"
    },
    {
      title: t.services.consultation.title,
      desc: t.services.consultation.desc,
      icon: <Cpu className="h-6 w-6 text-emerald-400" />,
      glow: "rgba(16, 185, 129, 0.18)"
    },
    {
      title: t.services.govGuide.title,
      desc: t.services.govGuide.desc,
      icon: <Search className="h-6 w-6 text-[#F6C453]" />,
      glow: "rgba(246, 196, 83, 0.18)"
    },
    {
      title: t.services.termExplainer.title,
      desc: t.services.termExplainer.desc,
      icon: <HelpCircle className="h-6 w-6 text-pink-400" />,
      glow: "rgba(244, 63, 94, 0.18)"
    },
    {
      title: t.services.caseTracker.title,
      desc: t.services.caseTracker.desc,
      icon: <Activity className="h-6 w-6 text-orange-400" />,
      glow: "rgba(249, 115, 22, 0.18)"
    }
  ];

  // Motion stagger settings
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <section id="services" className="py-24 bg-[#090909] relative scroll-mt-20">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge={isRtl ? "الخدمات المتقدمة" : "Premium Modules"}
          title={t.services.title}
          subtitle={t.services.subtitle}
          align="center"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {services.map((svc, idx) => (
            <motion.div key={idx} variants={cardVariants}>
              <Card
                glowColor={svc.glow}
                className="p-8 border border-white/5 bg-[#181818]/60 hover:border-white/10 flex flex-col items-start gap-4 transition duration-300 h-full group cursor-pointer"
              >
                {/* Glowing Icon Frame */}
                <div className="p-3.5 bg-white/5 rounded-2xl text-gray-300 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                  {svc.icon}
                </div>

                <div className="flex flex-col gap-2 mt-2 text-right">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition duration-200">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition duration-200">
                    {svc.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
