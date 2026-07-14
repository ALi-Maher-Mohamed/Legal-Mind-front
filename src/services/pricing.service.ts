// src/services/pricing.service.ts
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
          ctaKey: 'ctaFree'
        },
        {
          id: 'pro',
          nameKey: 'proName',
          priceMonthly: 49,
          priceYearly: 39, // Billed annually ($39/mo instead of $49/mo)
          featuresKeys: ['f4', 'f5', 'f6', 'f7', 'f8'],
          highlighted: true,
          ctaKey: 'ctaPro'
        },
        {
          id: 'enterprise',
          nameKey: 'enterpriseName',
          priceMonthly: 999, // Represents a placeholder for custom
          priceYearly: 799,
          featuresKeys: ['f9', 'f10', 'f11', 'f12'],
          highlighted: false,
          ctaKey: 'ctaEnterprise'
        }
      ]);
    });
  }
};
