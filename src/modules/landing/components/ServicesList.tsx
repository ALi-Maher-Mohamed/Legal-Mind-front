"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, SectionTitle } from "@/components/ui";
import {
  Shield,
  FileText,
  Cpu,
  Search,
  HelpCircle,
  Activity,
  type LucideIcon,
} from "lucide-react";

export default function ServicesList() {
  const { t } = useLanguage();

  const services: { title: string; desc: string; icon: LucideIcon }[] = [
    {
      title: t.services.docAnalysis.title,
      desc: t.services.docAnalysis.desc,
      icon: Shield,
    },
    {
      title: t.services.contractGen.title,
      desc: t.services.contractGen.desc,
      icon: FileText,
    },
    {
      title: t.services.consultation.title,
      desc: t.services.consultation.desc,
      icon: Cpu,
    },
    // {
    //   title: t.services.govGuide.title,
    //   desc: t.services.govGuide.desc,
    //   icon: Search,
    // },
    // {
    //   title: t.services.termExplainer.title,
    //   desc: t.services.termExplainer.desc,
    //   icon: HelpCircle,
    // },
    // {
    //   title: t.services.caseTracker.title,
    //   desc: t.services.caseTracker.desc,
    //   icon: Activity,
    // },
  ];

  return (
    <section
      id="services"
      className="relative scroll-mt-20 bg-background py-16 md:py-20"
    >
      <div className="lm-container relative z-10">
        <SectionTitle
          title={t.services.title}
          subtitle={t.services.subtitle}
          align="center"
        />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <Card
                  className="flex h-full flex-col items-stretch gap-4 p-6 sm:p-8 text-start group"
                  hoverGlow
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand/15">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-brand transition">
                    {svc.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {svc.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
