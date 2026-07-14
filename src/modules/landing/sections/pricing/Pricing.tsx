'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { SectionTitle } from '@/components/ui';
import { usePricingPlans } from '../../hooks/usePricingPlans';
import PricingToggle from './PricingToggle';
import PricingCard from './PricingCard';

export default function Pricing() {
  const { t, isRtl } = useLanguage();
  const { plans, isYearly, toggleBilling } = usePricingPlans();

  return (
    <section id="pricing" className="py-24 bg-[#090909] relative scroll-mt-20">
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge={isRtl ? 'الباقات والأسعار' : 'SaaS Plans'}
          title={t.pricing.title}
          subtitle={t.pricing.subtitle}
          align="center"
        />
        <PricingToggle isYearly={isYearly} onToggle={toggleBilling} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} isYearly={isYearly} />
          ))}
        </div>
      </div>
    </section>
  );
}
