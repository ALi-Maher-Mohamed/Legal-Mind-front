'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button, Card } from '@/components/ui';
import { PricingPlan } from '@/types/pricing.types';

type PricingCardProps = {
  plan: PricingPlan;
  isYearly: boolean;
};

function getPriceText(plan: PricingPlan, isYearly: boolean, t: ReturnType<typeof useLanguage>['t']) {
  if (plan.id === 'free') return t.pricing.freePrice;
  if (plan.id === 'enterprise') return t.pricing.enterprisePrice;
  return `$${isYearly ? plan.priceYearly : plan.priceMonthly}`;
}

export default function PricingCard({ plan, isYearly }: PricingCardProps) {
  const { t } = useLanguage();
  const isEnterprise = plan.id === 'enterprise';
  const priceText = getPriceText(plan, isYearly, t);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: plan.id === 'pro' ? 0.1 : 0 }}
      className="h-full"
    >
      <Card
        glowColor={plan.highlighted ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)'}
        className={`p-8 border h-full flex flex-col justify-between transition-all duration-300 ${
          plan.highlighted
            ? 'border-blue-500/30 bg-[#121212] shadow-[0_10px_35px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/10'
            : 'border-white/5 bg-[#181818]/60'
        }`}
      >
        <div className="text-start">
          {plan.highlighted && (
            <span className="mb-4 inline-block rounded-full bg-blue-500/15 px-3 py-0.5 text-[10px] font-semibold tracking-wider text-blue-400 border border-blue-500/30 uppercase">
              {t.common.popular}
            </span>
          )}
          <h3 className="text-lg font-bold text-white mb-2">
            {t.pricing[plan.nameKey as keyof typeof t.pricing] as string}
          </h3>
          <div className="flex items-baseline gap-1 mt-4 mb-6">
            <span className="text-3xl font-extrabold text-white tracking-tight">{priceText}</span>
            {!isEnterprise && (
              <span className="text-xs text-gray-500">
                {isYearly ? t.pricing.yearlyLabel : t.pricing.monthlyLabel}
              </span>
            )}
          </div>
          <div className="h-px bg-white/5 my-6" />
          <ul className="space-y-4">
            {plan.featuresKeys.map((featKey) => (
              <li key={featKey} className="flex items-start gap-3 text-xs sm:text-sm text-gray-400">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Check className="h-3 w-3" />
                </div>
                <span>{t.pricing.features[featKey as keyof typeof t.pricing.features] as string}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <Button variant={plan.highlighted ? 'primary' : 'secondary'} fullWidth size="md">
            {t.pricing[plan.ctaKey as keyof typeof t.pricing] as string}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
