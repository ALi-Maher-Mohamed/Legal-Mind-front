import type { CheckoutPlanKey, CreateCheckoutPayload } from '@/types/payments.types';

export type CheckoutPlan = CreateCheckoutPayload & {
  key: CheckoutPlanKey;
  /** Display price in major units (e.g. dollars). */
  displayPrice: number;
  billing: 'monthly' | 'yearly';
};

/**
 * Frontend checkout catalog.
 * `amount` is always in cents (smallest currency unit).
 * Matches Postman example for monthly: pro-monthly @ 2999 ($29.99).
 */
export const CHECKOUT_PLANS: Record<CheckoutPlanKey, CheckoutPlan> = {
  'pro-monthly': {
    key: 'pro-monthly',
    planId: 'pro-monthly',
    amount: 2999,
    displayPrice: 29.99,
    currency: 'usd',
    description: 'Pro Plan - Monthly',
    billing: 'monthly',
    metadata: { feature: 'subscription', interval: 'monthly' },
  },
  'pro-yearly': {
    key: 'pro-yearly',
    planId: 'pro-yearly',
    // ~20% off vs monthly × 12 → $23.99/mo billed annually
    amount: 28788,
    displayPrice: 23.99,
    currency: 'usd',
    description: 'Pro Plan - Yearly',
    billing: 'yearly',
    metadata: { feature: 'subscription', interval: 'yearly' },
  },
};

export function isCheckoutPlanKey(value: string): value is CheckoutPlanKey {
  return value === 'pro-monthly' || value === 'pro-yearly';
}

export function getCheckoutPlan(key: CheckoutPlanKey): CheckoutPlan {
  return CHECKOUT_PLANS[key];
}

/** Convert major-unit price to cents for the API. */
export function toAmountCents(price: number): number {
  return Math.round(price * 100);
}
