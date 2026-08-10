'use client';

import { useCallback, useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import type {
  DashboardActivityDay,
  DashboardActivityPagination,
  DashboardActivityPeriod,
} from '@/types/dashboard.types';

const PAGE_LIMIT = 10;

export function useDeskActivity() {
  const [daily, setDaily] = useState<DashboardActivityDay[]>([]);
  const [period, setPeriod] = useState<DashboardActivityPeriod | null>(null);
  const [pagination, setPagination] = useState<DashboardActivityPagination>({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    pages: 0,
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (nextPage: number, append: boolean) => {
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);
    setError(null);

    try {
      const result = await dashboardService.getActivity({
        page: nextPage,
        limit: PAGE_LIMIT,
      });

      setPeriod(result.period);
      setPagination(result.pagination);
      setPage(result.pagination.page || nextPage);
      setDaily((prev) => {
        if (!append) return result.daily;
        return mergeDaily(prev, result.daily);
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'تعذّر تحميل سجل النشاط',
      );
      if (!append) setDaily([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void load(1, false);
  }, [load]);

  const hasMore =
    pagination.pages > 0 && page < pagination.pages;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    void load(page + 1, true);
  }, [hasMore, isLoadingMore, load, page]);

  const refresh = useCallback(() => {
    void load(1, false);
  }, [load]);

  return {
    daily,
    period,
    pagination,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

function mergeDaily(
  current: DashboardActivityDay[],
  incoming: DashboardActivityDay[],
): DashboardActivityDay[] {
  const map = new Map<string, DashboardActivityDay>();

  for (const day of current) {
    map.set(day.date, {
      ...day,
      records: [...day.records],
    });
  }

  for (const day of incoming) {
    const existing = map.get(day.date);
    if (!existing) {
      map.set(day.date, {
        ...day,
        records: [...day.records],
      });
      continue;
    }

    const seen = new Set(
      existing.records.map(
        (record, index) =>
          record.id || `${record.timestamp}:${record.type}:${index}`,
      ),
    );

    for (const [index, record] of day.records.entries()) {
      const key = record.id || `${record.timestamp}:${record.type}:${index}`;
      if (seen.has(key)) continue;
      existing.records.push(record);
      seen.add(key);
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}
