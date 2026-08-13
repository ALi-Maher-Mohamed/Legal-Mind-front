import { api } from '@/lib/api/client';
import type {
  CheckoutSession,
  CheckoutStatus,
  CreateCheckoutPayload,
  PaymentHistoryParams,
  PaymentHistoryResult,
  PaymentRecord,
} from '@/types/payments.types';

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;
}

function unwrapData(payload: unknown): Record<string, unknown> | null {
  const root = asRecord(payload);
  if (!root) return null;
  const nested = asRecord(root.data);
  return nested ?? root;
}

function pickString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function pickNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeCheckoutSession(payload: unknown): CheckoutSession {
  const data = unwrapData(payload);
  const sessionId = pickString(data?.sessionId || data?.session_id);
  const url = pickString(data?.url);
  if (!sessionId || !url) {
    throw new Error('استجابة جلسة الدفع غير مكتملة');
  }
  return { sessionId, url };
}

function normalizeCheckoutStatus(payload: unknown): CheckoutStatus {
  const data = unwrapData(payload);
  return {
    sessionId: pickString(data?.session_id || data?.sessionId),
    status: pickString(data?.status || data?.payment_status, 'unpaid'),
    paymentStatus: pickString(data?.payment_status || data?.status, 'unpaid'),
    amount: pickNumber(data?.amount),
    currency: pickString(data?.currency, 'usd'),
    dbStatus: pickString(data?.db_status || data?.dbStatus, 'pending'),
  };
}

function normalizePayment(raw: unknown): PaymentRecord | null {
  const row = asRecord(raw);
  if (!row) return null;
  const id = pickString(row.id || row._id);
  if (!id) return null;

  return {
    id,
    planId: pickString(row.plan_id || row.planId),
    amount: pickNumber(row.amount),
    currency: pickString(row.currency, 'usd'),
    status: pickString(row.status, 'pending'),
    description: pickString(row.description),
    stripeSessionId: pickString(
      row.stripe_session_id || row.stripeSessionId,
    ),
    createdAt: pickString(row.created_at || row.createdAt),
  };
}

function normalizeHistory(payload: unknown): PaymentHistoryResult {
  const root = asRecord(payload);
  const data = unwrapData(payload);
  const listSource =
    (Array.isArray(data?.payments) && data.payments) ||
    (Array.isArray(root?.payments) && root.payments) ||
    [];

  const payments = (listSource as unknown[])
    .map(normalizePayment)
    .filter((item): item is PaymentRecord => Boolean(item));

  const paginationSource =
    asRecord(data?.pagination) || asRecord(root?.pagination) || {};

  const page = pickNumber(paginationSource.page, 1);
  const limit = pickNumber(paginationSource.limit, 10);
  const total = pickNumber(paginationSource.total, payments.length);
  const pages = pickNumber(
    paginationSource.pages,
    total > 0 ? Math.max(1, Math.ceil(total / limit)) : 0,
  );

  return {
    payments,
    pagination: { page, limit, total, pages },
  };
}

function buildHistoryQuery(params: PaymentHistoryParams = {}) {
  const query = new URLSearchParams();
  query.set('page', String(params.page ?? 1));
  query.set('limit', String(params.limit ?? 10));
  if (params.status) query.set('status', params.status);
  return `?${query.toString()}`;
}

export const paymentsService = {
  /** POST /api/v1/payments/checkout → { sessionId, url } */
  async createCheckout(
    payload: CreateCheckoutPayload,
  ): Promise<CheckoutSession> {
    const response = await api.post<unknown>(
      '/api/v1/payments/checkout',
      {
        json: {
          planId: payload.planId,
          amount: payload.amount,
          currency: payload.currency ?? 'usd',
          description: payload.description,
          ...(payload.metadata ? { metadata: payload.metadata } : {}),
        },
      },
      { auth: true },
    );
    return normalizeCheckoutSession(response);
  },

  /** GET /api/v1/payments/checkout/status?session_id= */
  async getCheckoutStatus(sessionId: string): Promise<CheckoutStatus> {
    const id = sessionId.trim();
    if (!id) throw new Error('معرّف جلسة الدفع مطلوب');

    const response = await api.get<unknown>(
      `/api/v1/payments/checkout/status?session_id=${encodeURIComponent(id)}`,
      { auth: true },
    );
    return normalizeCheckoutStatus(response);
  },

  /** GET /api/v1/payments/history */
  async getHistory(
    params: PaymentHistoryParams = {},
  ): Promise<PaymentHistoryResult> {
    const response = await api.get<unknown>(
      `/api/v1/payments/history${buildHistoryQuery(params)}`,
      { auth: true },
    );
    return normalizeHistory(response);
  },
};
