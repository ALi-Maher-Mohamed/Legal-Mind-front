'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { SectionTitle } from '@/components/ui';
import { SERVICES } from '../../data/services.data';
import { staggerContainer, fadeUpCard } from '../../lib/motionVariants';
import ServiceCard from './ServiceCard';

export default function ServicesList() {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-24 bg-[#090909] relative scroll-mt-20">
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge="الخدمات المتقدمة"
          title={t.services.title}
          subtitle={t.services.subtitle}
          align="center"
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            const service = t.services[svc.key];
            return (
              <motion.div key={svc.key} variants={fadeUpCard}>
                <ServiceCard
                  title={service.title}
                  desc={service.desc}
                  glow={svc.glow}
                  icon={<Icon className={`h-6 w-6 ${svc.iconClass}`} />}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
