'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { STATS } from '../../data/stats.data';
import StatCard from './StatCard';

export default function Stats() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-[#090909] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {STATS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <StatCard
                key={item.id}
                target={item.target}
                suffix={item.suffix}
                label={t.stats[item.labelKey]}
                glow={item.glow}
                delay={idx * 0.1}
                icon={<Icon className={`h-6 w-6 ${item.iconClass}`} />}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
