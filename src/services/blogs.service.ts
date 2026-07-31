import { api } from '@/lib/api/client';
import type {
  Blog,
  BlogCategory,
  BlogListParams,
  BlogListResult,
  BookmarkResult,
  CreateBlogPayload,
  UpdateBlogPayload,
} from '@/types/blog.types';

function buildQuery(params: BlogListParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.sort) query.set('sort', params.sort);
  if (params.search?.trim()) query.set('search', params.search.trim());
  if (params.category?.trim()) query.set('category', params.category.trim());
  if (params.tags?.trim()) query.set('tags', params.tags.trim());
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

type ListResponse = {
  blogs: Blog[];
  pagination: BlogListResult['pagination'];
};

type BlogEnvelope = {
  blog: Blog;
};

type CategoriesEnvelope = {
  categories: BlogCategory[];
};

export const blogsService = {
  async list(params: BlogListParams = {}): Promise<BlogListResult> {
    const response = await api.get<ListResponse>(`/api/blogs${buildQuery(params)}`);
    return {
      blogs: response.data?.blogs ?? [],
      pagination: response.data?.pagination ?? {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total: 0,
        pages: 0,
      },
    };
  },

  async getCategories(): Promise<BlogCategory[]> {
    const response = await api.get<CategoriesEnvelope>('/api/blogs/categories');
    return response.data?.categories ?? [];
  },

  async getPopular(limit = 10): Promise<Blog[]> {
    const response = await api.get<{ blogs: Blog[] }>(`/api/blogs/popular?limit=${limit}`);
    return response.data?.blogs ?? [];
  },

  async getTrending(limit = 10): Promise<Blog[]> {
    const response = await api.get<{ blogs: Blog[] }>(`/api/blogs/trending?limit=${limit}`);
    return response.data?.blogs ?? [];
  },

  async getById(blogId: string): Promise<Blog> {
    const response = await api.get<BlogEnvelope>(`/api/blogs/${blogId}`, { auth: true });
    return response.data.blog;
  },

  async create(payload: CreateBlogPayload): Promise<Blog> {
    const response = await api.post<BlogEnvelope>(
      '/api/blogs',
      { json: payload },
      { auth: true },
    );
    return response.data.blog;
  },

  async update(blogId: string, payload: UpdateBlogPayload): Promise<Blog> {
    const response = await api.put<BlogEnvelope>(
      `/api/blogs/${blogId}`,
      { json: payload },
      { auth: true },
    );
    return response.data.blog;
  },

  async remove(blogId: string): Promise<string> {
    const response = await api.delete<null>(`/api/blogs/${blogId}`, { auth: true });
    return response.message || 'تم حذف المقالة بنجاح';
  },

  async toggleBookmark(blogId: string): Promise<BookmarkResult> {
    const response = await api.post<BookmarkResult>(
      `/api/blogs/${blogId}/bookmark`,
      undefined,
      { auth: true },
    );
    return response.data;
  },
};
