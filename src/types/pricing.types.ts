// src/types/pricing.types.ts

export interface PricingPlan {
  id: string;
  nameKey: string; // plan name translation key (e.g. Free, Pro, Enterprise)
  priceMonthly: number;
  priceYearly: number;
  featuresKeys: string[]; // array of feature translation keys
  highlighted: boolean;
  ctaKey: string; // cta button translation key
}
