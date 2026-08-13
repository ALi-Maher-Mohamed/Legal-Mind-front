import { ROUTES } from '@/config/routes';
import { authService } from '@/services/auth.service';
import { paymentsService } from '@/services/payments.service';
import type { CheckoutPlanKey } from '@/types/payments.types';
import { getCheckoutPlan, isCheckoutPlanKey } from '../data/plans';

const PENDING_CHECKOUT_KEY = 'lm_pending_checkout_plan';
const LAST_CHECKOUT_PLAN_KEY = 'lm_last_checkout_plan';
const LAST_SESSION_KEY = 'lm_stripe_session_id';

export function stashPendingCheckout(planKey: CheckoutPlanKey) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(PENDING_CHECKOUT_KEY, planKey);
}

export function peekPendingCheckout(): CheckoutPlanKey | null {
  if (typeof window === 'undefined') return null;
  const value = sessionStorage.getItem(PENDING_CHECKOUT_KEY);
  return value && isCheckoutPlanKey(value) ? value : null;
}

export function takePendingCheckout(): CheckoutPlanKey | null {
  const value = peekPendingCheckout();
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
  }
  return value;
}

export function rememberLastCheckoutPlan(planKey: CheckoutPlanKey) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(LAST_CHECKOUT_PLAN_KEY, planKey);
}

export function readLastCheckoutPlan(): CheckoutPlanKey | null {
  if (typeof window === 'undefined') return null;
  const value = sessionStorage.getItem(LAST_CHECKOUT_PLAN_KEY);
  return value && isCheckoutPlanKey(value) ? value : null;
}

export function rememberCheckoutSession(sessionId: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(LAST_SESSION_KEY, sessionId);
}

export function readRememberedCheckoutSession(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(LAST_SESSION_KEY);
}

/**
 * Creates a Stripe Checkout session and redirects the browser to Stripe.
 * If the user is not authenticated, stashes the plan and sends them to login.
 */
export async function startCheckout(planKey: CheckoutPlanKey): Promise<void> {
  const plan = getCheckoutPlan(planKey);
  rememberLastCheckoutPlan(planKey);
  const session = await authService.restoreSession();

  if (!session) {
    stashPendingCheckout(planKey);
    window.location.assign(ROUTES.login);
    return;
  }

  const checkout = await paymentsService.createCheckout({
    planId: plan.planId,
    amount: plan.amount,
    currency: plan.currency,
    description: plan.description,
    metadata: plan.metadata,
  });

  rememberCheckoutSession(checkout.sessionId);
  window.location.assign(checkout.url);
}

/** After login: resume any pending checkout, otherwise go to dashboard. */
export async function resumePendingCheckoutOrDashboard(): Promise<string> {
  const pending = takePendingCheckout();
  if (!pending) return ROUTES.dashboard;

  try {
    await startCheckout(pending);
    // startCheckout redirects away on success; fallback path if it returns.
    return ROUTES.dashboard;
  } catch {
    stashPendingCheckout(pending);
    return `${ROUTES.dashboard}?view=profile`;
  }
}
