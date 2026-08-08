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
  const search = params.search?.trim();
  const category = params.category?.trim();
  const tags = params.tags?.trim();
  if (search) query.set('search', search);
  if (category) query.set('category', category);
  if (tags) query.set('tags', tags);
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

type ListResponse = {
  blogs: Blog[];
  pagination: BlogListResult['pagination'];
};

type BlogResponse = {
  blog: Blog;
  message?: string;
};

type CategoriesResponse = {
  categories: BlogCategory[];
};

export const blogsService = {
  async list(params: BlogListParams = {}): Promise<BlogListResult> {
    const response = await api.get<ListResponse | Blog[]>(
      `/api/v1/blogs${buildQuery(params)}`,
    );

    if (Array.isArray(response)) {
      return {
        blogs: response,
        pagination: {
          page: params.page ?? 1,
          limit: params.limit ?? response.length,
          total: response.length,
          pages: 1,
        },
      };
    }

    return {
      blogs: response?.blogs ?? [],
      pagination: response?.pagination ?? {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total: response?.blogs?.length ?? 0,
        pages: 1,
      },
    };
  },

  async getCategories(): Promise<BlogCategory[]> {
    const response = await api.get<CategoriesResponse>('/api/v1/blogs/categories');
    return response?.categories ?? [];
  },

  async getPopular(limit = 10): Promise<Blog[]> {
    const response = await api.get<{ blogs: Blog[] }>(
      `/api/v1/blogs/popular?limit=${limit}`,
    );
    return response?.blogs ?? [];
  },

  async getTrending(limit = 10): Promise<Blog[]> {
    const response = await api.get<{ blogs: Blog[] }>(
      `/api/v1/blogs/trending?limit=${limit}`,
    );
    return response?.blogs ?? [];
  },

  async getById(blogId: string): Promise<Blog> {
    const response = await api.get<BlogResponse>(`/api/v1/blogs/${blogId}`, {
      auth: true,
    });
    return response.blog;
  },

  async create(payload: CreateBlogPayload): Promise<{ blog: Blog; message?: string }> {
    const response = await api.post<BlogResponse>(
      '/api/v1/blogs',
      { json: payload },
      { auth: true },
    );
    return { blog: response.blog, message: response.message };
  },

  async update(
    blogId: string,
    payload: UpdateBlogPayload,
  ): Promise<{ blog: Blog; message?: string }> {
    const response = await api.put<BlogResponse>(
      `/api/v1/blogs/${blogId}`,
      { json: payload },
      { auth: true },
    );
    if (!response?.blog) {
      throw new Error('');
    }
    return { blog: response.blog, message: response.message };
  },

  async remove(blogId: string): Promise<void> {
    await api.delete(`/api/v1/blogs/${blogId}`, { auth: true });
  },

  async toggleBookmark(blogId: string): Promise<BookmarkResult> {
    return api.post<BookmarkResult>(
      `/api/v1/blogs/${blogId}/bookmark`,
      undefined,
      { auth: true },
    );
  },
};
