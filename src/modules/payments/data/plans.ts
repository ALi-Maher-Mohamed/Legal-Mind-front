import type {
  CheckoutPlanKey,
  CreateCheckoutPayload,
  SubscriptionTierId,
} from '@/types/payments.types';

export type CheckoutPlan = CreateCheckoutPayload & {
  key: CheckoutPlanKey;
  tier: Exclude<SubscriptionTierId, 'free'>;
  /** Display price per month in major units (USD). */
  displayPrice: number;
  billing: 'monthly' | 'yearly';
};

/** Monthly usage limits. `null` = unlimited. */
export type TierLimits = {
  id: SubscriptionTierId;
  contractAnalysesPerMonth: number | null;
  qaQueriesPerMonth: number | null;
  contractGenerationsPerMonth: number | null;
  conversationHistory: boolean;
  priorityProcessing: boolean;
  apiAccess: boolean;
  dedicatedSupport: boolean;
  batchProcessing: boolean;
};

/**
 * Freemium SaaS model (source of truth for UI + checkout amounts).
 * Free $0 · Basic $15/mo · Pro $40/mo
 * Yearly = ~20% off (billed annually, display as effective monthly).
 */
export const SUBSCRIPTION_LIMITS: Record<SubscriptionTierId, TierLimits> = {
  free: {
    id: 'free',
    contractAnalysesPerMonth: 3,
    qaQueriesPerMonth: 10,
    contractGenerationsPerMonth: 1,
    conversationHistory: false,
    priorityProcessing: false,
    apiAccess: false,
    dedicatedSupport: false,
    batchProcessing: false,
  },
  basic: {
    id: 'basic',
    contractAnalysesPerMonth: 30,
    qaQueriesPerMonth: 100,
    contractGenerationsPerMonth: 15,
    conversationHistory: true,
    priorityProcessing: true,
    apiAccess: false,
    dedicatedSupport: false,
    batchProcessing: false,
  },
  pro: {
    id: 'pro',
    contractAnalysesPerMonth: null,
    qaQueriesPerMonth: null,
    contractGenerationsPerMonth: 50,
    conversationHistory: true,
    priorityProcessing: true,
    apiAccess: true,
    dedicatedSupport: true,
    batchProcessing: true,
  },
};

const YEARLY_DISCOUNT = 0.8; // 20% off

function yearlyFromMonthly(monthlyUsd: number) {
  const effectiveMonthly = Math.round(monthlyUsd * YEARLY_DISCOUNT * 100) / 100;
  const annualUsd = Math.round(effectiveMonthly * 12 * 100) / 100;
  return {
    displayPrice: effectiveMonthly,
    amount: Math.round(annualUsd * 100),
  };
}

/**
 * Checkout catalog — `amount` is always in cents.
 * Basic $15 → 1500 · Pro $40 → 4000
 */
export const CHECKOUT_PLANS: Record<CheckoutPlanKey, CheckoutPlan> = {
  'basic-monthly': {
    key: 'basic-monthly',
    tier: 'basic',
    planId: 'basic-monthly',
    amount: 1500,
    displayPrice: 15,
    currency: 'usd',
    description: 'Basic Plan - Monthly',
    billing: 'monthly',
    metadata: { feature: 'subscription', tier: 'basic', interval: 'monthly' },
  },
  'basic-yearly': {
    key: 'basic-yearly',
    tier: 'basic',
    planId: 'basic-yearly',
    ...yearlyFromMonthly(15),
    currency: 'usd',
    description: 'Basic Plan - Yearly',
    billing: 'yearly',
    metadata: { feature: 'subscription', tier: 'basic', interval: 'yearly' },
  },
  'pro-monthly': {
    key: 'pro-monthly',
    tier: 'pro',
    planId: 'pro-monthly',
    amount: 4000,
    displayPrice: 40,
    currency: 'usd',
    description: 'Pro Plan - Monthly',
    billing: 'monthly',
    metadata: { feature: 'subscription', tier: 'pro', interval: 'monthly' },
  },
  'pro-yearly': {
    key: 'pro-yearly',
    tier: 'pro',
    planId: 'pro-yearly',
    ...yearlyFromMonthly(40),
    currency: 'usd',
    description: 'Pro Plan - Yearly',
    billing: 'yearly',
    metadata: { feature: 'subscription', tier: 'pro', interval: 'yearly' },
  },
};

const CHECKOUT_KEYS = Object.keys(CHECKOUT_PLANS) as CheckoutPlanKey[];

export function isCheckoutPlanKey(value: string): value is CheckoutPlanKey {
  return CHECKOUT_KEYS.includes(value as CheckoutPlanKey);
}

export function getCheckoutPlan(key: CheckoutPlanKey): CheckoutPlan {
  return CHECKOUT_PLANS[key];
}

export function resolveCheckoutPlanKey(
  tier: 'basic' | 'pro',
  yearly: boolean,
): CheckoutPlanKey {
  if (tier === 'basic') return yearly ? 'basic-yearly' : 'basic-monthly';
  return yearly ? 'pro-yearly' : 'pro-monthly';
}

/** Convert major-unit price to cents for the API. */
export function toAmountCents(price: number): number {
  return Math.round(price * 100);
}
