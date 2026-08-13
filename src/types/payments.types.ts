/** Payment API contracts — Stripe checkout + history. */

export type PaymentDbStatus =
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded';

export type StripePaymentStatus =
  | 'paid'
  | 'unpaid'
  | 'no_payment_required'
  | string;

export type CreateCheckoutPayload = {
  planId: string;
  /** Amount in smallest currency unit (cents / piastres). */
  amount: number;
  currency?: string;
  description: string;
  metadata?: Record<string, string>;
};

export type CheckoutSession = {
  sessionId: string;
  url: string;
};

export type CheckoutStatus = {
  sessionId: string;
  status: StripePaymentStatus;
  paymentStatus: StripePaymentStatus;
  amount: number;
  currency: string;
  dbStatus: PaymentDbStatus | string;
};

export type PaymentRecord = {
  id: string;
  planId: string;
  amount: number;
  currency: string;
  status: PaymentDbStatus | string;
  description: string;
  stripeSessionId: string;
  createdAt: string;
};

export type PaymentHistoryParams = {
  page?: number;
  limit?: number;
  status?: PaymentDbStatus | '';
};

export type PaymentHistoryResult = {
  payments: PaymentRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

/** Checkout catalog keys used by the frontend UI. */
export type CheckoutPlanKey = 'pro-monthly' | 'pro-yearly';
