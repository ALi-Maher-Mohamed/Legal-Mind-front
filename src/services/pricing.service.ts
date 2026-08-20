// src/services/pricing.service.ts
import { CHECKOUT_PLANS } from "@/modules/payments/data/plans";
import { PricingPlan } from "@/types/pricing.types";

export const pricingService = {
  getPlans: (): Promise<PricingPlan[]> => {
    return new Promise((resolve) => {
      resolve([
        {
          id: "free",
          nameKey: "freeName",
          priceMonthly: 0,
          priceYearly: 0,
          featuresKeys: ["free1", "free2", "free3", "free4"],
          highlighted: false,
          ctaKey: "ctaFree",
        },
        {
          id: "basic",
          nameKey: "basicName",
          priceMonthly: CHECKOUT_PLANS["basic-monthly"].displayPrice,
          priceYearly: CHECKOUT_PLANS["basic-yearly"].displayPrice,
          featuresKeys: ["basic1", "basic2", "basic3", "basic4", "basic5"],
          highlighted: false,
          ctaKey: "ctaBasic",
        },
        {
          id: "pro",
          nameKey: "proName",
          priceMonthly: CHECKOUT_PLANS["pro-monthly"].displayPrice,
          priceYearly: CHECKOUT_PLANS["pro-yearly"].displayPrice,
          featuresKeys: ["pro1", "pro2", "pro3", "pro5", "pro6"],
          highlighted: true,
          ctaKey: "ctaPro",
        },
      ]);
    });
  },
};
