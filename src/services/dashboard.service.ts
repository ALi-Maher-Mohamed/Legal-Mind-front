import { api } from '@/lib/api/client';
import type {
  DashboardActivityParams,
  DashboardActivityResponse,
} from '@/types/dashboard.types';

function buildQuery(params: DashboardActivityParams = {}) {
  const query = new URLSearchParams();
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

function normalizeActivityResponse(payload: unknown): DashboardActivityResponse {
  if (!payload || typeof payload !== 'object') {
    return {
      period: { start: '', end: '' },
      daily: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    };
  }

  const body = payload as Record<string, unknown>;
  const data =
    body.data && typeof body.data === 'object'
      ? (body.data as Record<string, unknown>)
      : body;

  const period =
    data.period && typeof data.period === 'object'
      ? (data.period as DashboardActivityResponse['period'])
      : { start: '', end: '' };

  const daily = Array.isArray(data.daily)
    ? (data.daily as DashboardActivityResponse['daily'])
    : [];

  const pagination =
    data.pagination && typeof data.pagination === 'object'
      ? (data.pagination as DashboardActivityResponse['pagination'])
      : { page: 1, limit: 10, total: 0, pages: 0 };

  return { period, daily, pagination };
}

export const dashboardService = {
  /** GET /api/v1/dashboard/activity — daily activity feed for the authenticated user. */
  async getActivity(
    params: DashboardActivityParams = {},
  ): Promise<DashboardActivityResponse> {
    const response = await api.get<unknown>(
      `/api/v1/dashboard/activity${buildQuery({
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        startDate: params.startDate,
        endDate: params.endDate,
      })}`,
      { auth: true },
    );
    return normalizeActivityResponse(response);
  },
};
