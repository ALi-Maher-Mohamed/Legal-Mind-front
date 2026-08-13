// src/services/pricing.service.ts
import { CHECKOUT_PLANS } from '@/modules/payments/data/plans';
import { PricingPlan } from '@/types/pricing.types';

export const pricingService = {
  getPlans: (): Promise<PricingPlan[]> => {
    return new Promise((resolve) => {
      resolve([
        {
          id: 'free',
          nameKey: 'freeName',
          priceMonthly: 0,
          priceYearly: 0,
          featuresKeys: ['f1', 'f2', 'f3'],
          highlighted: false,
          ctaKey: 'ctaFree',
        },
        {
          id: 'pro',
          nameKey: 'proName',
          priceMonthly: CHECKOUT_PLANS['pro-monthly'].displayPrice,
          priceYearly: CHECKOUT_PLANS['pro-yearly'].displayPrice,
          featuresKeys: ['f4', 'f5', 'f6', 'f7', 'f8'],
          highlighted: true,
          ctaKey: 'ctaPro',
        },
        {
          id: 'enterprise',
          nameKey: 'enterpriseName',
          priceMonthly: 999,
          priceYearly: 799,
          featuresKeys: ['f9', 'f10', 'f11', 'f12'],
          highlighted: false,
          ctaKey: 'ctaEnterprise',
        },
      ]);
    });
  },
};
