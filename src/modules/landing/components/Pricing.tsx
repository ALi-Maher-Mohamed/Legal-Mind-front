'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button, Card, SectionTitle } from '@/components/ui';
import { pricingService } from '@/services/pricing.service';
import { PricingPlan } from '@/types/pricing.types';
import { Check } from 'lucide-react';

export default function Pricing() {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    pricingService.getPlans().then((data) => setPlans(data));
  }, []);

  return (
    <section id="pricing" className="relative scroll-mt-20 bg-background py-16 md:py-20">
      <div className="lm-container relative z-10">
        <SectionTitle badge="PRICING" title={t.pricing.title} subtitle={t.pricing.subtitle} align="center" />

        <div className="mb-10 flex items-center justify-center gap-3 select-none sm:mb-12 sm:gap-4">
          <span className={`text-xs sm:text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted'}`}>
            {t.common.monthly}
          </span>
          <button
            type="button"
            dir="ltr"
            onClick={() => setIsYearly(!isYearly)}
            className="relative h-6 w-11 rounded-full bg-surface-muted border border-outline transition focus:outline-none cursor-pointer"
            aria-pressed={isYearly}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-brand ${isYearly ? 'right-0.5' : 'left-0.5'}`}
            />
          </button>
          <span className={`text-xs sm:text-sm font-medium flex items-center gap-1.5 ${isYearly ? 'text-foreground' : 'text-muted'}`}>
            {t.common.yearly}
            <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
              {t.common.save20}
            </span>
          </span>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-8">
          {plans.map((plan) => {
            const isFree = plan.id === 'free';
            const isEnterprise = plan.id === 'enterprise';
            let priceText = '';
            if (isFree) priceText = t.pricing.freePrice;
            else if (isEnterprise) priceText = t.pricing.enterprisePrice;
            else priceText = `$${isYearly ? plan.priceYearly : plan.priceMonthly}`;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <Card
                  className={`flex h-full flex-col justify-between p-6 sm:p-8 ${
                    plan.highlighted
                      ? 'border-brand/40 ring-1 ring-brand/20 shadow-[0_10px_35px_rgba(0,62,199,0.12)]'
                      : ''
                  }`}
                >
                  <div className="text-start">
                    {plan.highlighted && (
                      <span className="mb-3 inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                        {t.common.popular}
                      </span>
                    )}
                    <h3 className="mb-2 text-lg font-bold text-foreground">
                      {t.pricing[plan.nameKey as keyof typeof t.pricing] as string}
                    </h3>
                    <div className="mb-6 mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold tracking-tight text-foreground">{priceText}</span>
                      {!isEnterprise && (
                        <span className="text-xs text-muted">
                          {isYearly ? t.pricing.yearlyLabel : t.pricing.monthlyLabel}
                        </span>
                      )}
                    </div>
                    <div className="my-5 h-px bg-outline/40" />
                    <ul className="space-y-3">
                      {plan.featuresKeys.map((featKey) => (
                        <li key={featKey} className="flex items-start gap-3 text-xs sm:text-sm text-muted">
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-brand/20 bg-brand/10 text-brand">
                            <Check className="h-3 w-3" />
                          </span>
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
          })}
        </div>
      </div>
    </section>
  );
}
