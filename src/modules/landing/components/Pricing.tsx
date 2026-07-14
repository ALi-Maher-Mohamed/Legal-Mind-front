// src/modules/landing/components/Pricing.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button, Card, SectionTitle } from '@/components/ui';
import { pricingService } from '@/services/pricing.service';
import { PricingPlan } from '@/types/pricing.types';
import { Check } from 'lucide-react';

export default function Pricing() {
  const { t, isRtl } = useLanguage();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    pricingService.getPlans().then((data) => setPlans(data));
  }, []);

  return (
    <section id="pricing" className="py-24 bg-[#090909] relative scroll-mt-20">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge={isRtl ? "الباقات والأسعار" : "SaaS Plans"}
          title={t.pricing.title}
          subtitle={t.pricing.subtitle}
          align="center"
        />

        {/* Monthly / Yearly Toggle Button */}
        <div className="flex items-center justify-center gap-4 mb-16 select-none">
          <span className={`text-xs sm:text-sm font-medium ${!isYearly ? 'text-white' : 'text-gray-500'} transition`}>
            {t.common.monthly}
          </span>
          
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative h-6 w-11 rounded-full bg-white/10 hover:bg-white/15 border border-white/5 transition duration-300 focus:outline-none cursor-pointer"
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-blue-500 ${
                isYearly ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>

          <span className={`text-xs sm:text-sm font-medium flex items-center gap-1.5 ${isYearly ? 'text-white' : 'text-gray-500'} transition`}>
            <span>{t.common.yearly}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
              {t.common.save20}
            </span>
          </span>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isFree = plan.id === 'free';
            const isEnterprise = plan.id === 'enterprise';

            // Calculate price based on toggle
            let priceText = '';
            if (isFree) {
              priceText = t.pricing.freePrice;
            } else if (isEnterprise) {
              priceText = t.pricing.enterprisePrice;
            } else {
              priceText = `$${isYearly ? plan.priceYearly : plan.priceMonthly}`;
            }

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: plan.id === 'pro' ? 0.1 : 0 }}
                className="h-full"
              >
                <Card
                  glowColor={plan.highlighted ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.05)"}
                  className={`p-8 border h-full flex flex-col justify-between transition-all duration-300 ${
                    plan.highlighted
                      ? 'border-blue-500/30 bg-[#121212] shadow-[0_10px_35px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/10'
                      : 'border-white/5 bg-[#181818]/60'
                  }`}
                >
                  <div className="text-right">
                    {/* Badge for Popular Plan */}
                    {plan.highlighted && (
                      <span className="mb-4 inline-block rounded-full bg-blue-500/15 px-3 py-0.5 text-[10px] font-semibold tracking-wider text-blue-400 border border-blue-500/30 uppercase">
                        {t.common.popular}
                      </span>
                    )}

                    {/* Plan name */}
                    <h3 className="text-lg font-bold text-white mb-2">
                      {t.pricing[plan.nameKey as keyof typeof t.pricing] as string}
                    </h3>

                    {/* Price and billing period details */}
                    <div className="flex items-baseline gap-1 mt-4 mb-6">
                      <span className="text-3xl font-extrabold text-white tracking-tight">
                        {priceText}
                      </span>
                      {!isEnterprise && (
                        <span className="text-xs text-gray-500">
                          {isYearly ? t.pricing.yearlyLabel : t.pricing.monthlyLabel}
                        </span>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-white/5 my-6" />

                    {/* Features list */}
                    <ul className="space-y-4">
                      {plan.featuresKeys.map((featKey) => (
                        <li key={featKey} className="flex items-start gap-3 text-xs sm:text-sm text-gray-400">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>
                            {t.pricing.features[featKey as keyof typeof t.pricing.features] as string}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <Button
                      variant={plan.highlighted ? 'primary' : 'secondary'}
                      fullWidth
                      size="md"
                    >
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
