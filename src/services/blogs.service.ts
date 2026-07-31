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
  // Only append filters when they have a real value (empty = all posts)
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

type BlogEnvelope = {
  blog: Blog;
};

type CategoriesEnvelope = {
  categories: BlogCategory[];
};

export const blogsService = {
  async list(params: BlogListParams = {}): Promise<BlogListResult> {
    const response = await api.get<ListResponse | Blog[]>(`/api/blogs${buildQuery(params)}`);
    const data = response.data;

    if (Array.isArray(data)) {
      return {
        blogs: data,
        pagination: {
          page: params.page ?? 1,
          limit: params.limit ?? data.length,
          total: data.length,
          pages: 1,
        },
      };
    }

    return {
      blogs: data?.blogs ?? [],
      pagination: data?.pagination ?? {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total: data?.blogs?.length ?? 0,
        pages: 1,
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
    const blog = response.data?.blog;
    if (!blog) {
      throw new Error(response.message || 'تعذّر تحديث المقال');
    }
    return blog;
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
