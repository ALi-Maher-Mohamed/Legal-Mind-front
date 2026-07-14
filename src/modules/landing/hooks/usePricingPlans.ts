'use client';

import { useState, useEffect } from 'react';
import { pricingService } from '@/services/pricing.service';
import { PricingPlan } from '@/types/pricing.types';

export function usePricingPlans() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    pricingService.getPlans().then(setPlans);
  }, []);

  const toggleBilling = () => setIsYearly((prev) => !prev);

  return { plans, isYearly, toggleBilling };
}
