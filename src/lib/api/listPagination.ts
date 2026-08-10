/** Shared extractors for list + pagination envelopes ({ data, pagination }). */

export type ListPagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export function extractListWithPagination<T>(
  response: unknown,
): { items: T[]; pagination: ListPagination } {
  const emptyPagination: ListPagination = {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  };

  if (Array.isArray(response)) {
    return {
      items: response as T[],
      pagination: {
        page: 1,
        limit: response.length,
        total: response.length,
        pages: response.length > 0 ? 1 : 0,
      },
    };
  }

  if (!response || typeof response !== 'object') {
    return { items: [], pagination: emptyPagination };
  }

  const root = response as Record<string, unknown>;
  let items: T[] = [];

  if (Array.isArray(root.data)) {
    items = root.data as T[];
  } else if (root.data && typeof root.data === 'object') {
    const nested = root.data as Record<string, unknown>;
    if (Array.isArray(nested.data)) items = nested.data as T[];
    else if (Array.isArray(nested.jobs)) items = nested.jobs as T[];
    else if (Array.isArray(nested.items)) items = nested.items as T[];
  } else if (Array.isArray(root.jobs)) {
    items = root.jobs as T[];
  } else if (Array.isArray(root.items)) {
    items = root.items as T[];
  }

  const paginationSource =
    root.pagination && typeof root.pagination === 'object'
      ? (root.pagination as Record<string, unknown>)
      : root.data &&
          typeof root.data === 'object' &&
          !Array.isArray(root.data) &&
          (root.data as Record<string, unknown>).pagination &&
          typeof (root.data as Record<string, unknown>).pagination === 'object'
        ? ((root.data as Record<string, unknown>).pagination as Record<
            string,
            unknown
          >)
        : null;

  const page =
    typeof paginationSource?.page === 'number' ? paginationSource.page : 1;
  const limit =
    typeof paginationSource?.limit === 'number'
      ? paginationSource.limit
      : items.length || 20;
  const total =
    typeof paginationSource?.total === 'number'
      ? paginationSource.total
      : items.length;
  const pages =
    typeof paginationSource?.pages === 'number'
      ? paginationSource.pages
      : total > 0
        ? 1
        : 0;

  return {
    items,
    pagination: { page, limit, total, pages },
  };
}
