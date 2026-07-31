import { api } from '@/lib/api/client';
import { sessionStore } from '@/lib/api/session';
import { mapApiUserToAuthUser } from '@/modules/auth/lib/mapAuthUser';
import type { ApiUser, AuthUser, UpdateProfilePayload } from '@/types/auth.types';
import type { Blog, BlogBookmark, BlogBookmarksResult, BlogPagination } from '@/types/blog.types';
import { blogsService } from '@/services/blogs.service';

type UserEnvelope = { user: ApiUser };

type BookmarksEnvelope = {
  bookmarks?: unknown[];
  items?: unknown[];
  blogs?: unknown[];
  pagination?: Partial<BlogPagination>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function pickId(value: unknown): string {
  const record = asRecord(value);
  if (!record) return typeof value === 'string' ? value : '';
  return String(record._id || record.id || '');
}

function coerceBlog(value: unknown): Blog | null {
  const record = asRecord(value);
  if (!record) return null;
  const id = pickId(record);
  const title = typeof record.title === 'string' ? record.title : '';
  if (!id || !title) return null;

  return {
    _id: id,
    id,
    title,
    content: typeof record.content === 'string' ? record.content : '',
    excerpt: typeof record.excerpt === 'string' ? record.excerpt : undefined,
    coverImage: (record.coverImage as string | null | undefined) ?? null,
    category: typeof record.category === 'string' ? record.category : '',
    tags: Array.isArray(record.tags) ? record.tags.filter((t): t is string => typeof t === 'string') : [],
    author: (record.author as Blog['author']) ?? null,
    status: typeof record.status === 'string' ? record.status : 'published',
    views: typeof record.views === 'number' ? record.views : 0,
    bookmarksCount: typeof record.bookmarksCount === 'number' ? record.bookmarksCount : 0,
    likesCount: typeof record.likesCount === 'number' ? record.likesCount : 0,
    isBookmarked: true,
    readingTime: typeof record.readingTime === 'number' ? record.readingTime : undefined,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : '',
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : '',
    publishedAt: typeof record.publishedAt === 'string' ? record.publishedAt : undefined,
  };
}

function normalizeBookmark(raw: unknown): BlogBookmark | null {
  const record = asRecord(raw);
  if (!record) return null;

  const nestedBlog = coerceBlog(record.blog) || coerceBlog(record.post) || coerceBlog(record.article);
  const asBlog = nestedBlog || coerceBlog(record);
  if (!asBlog) return null;

  const blogId = pickId(record.blogId) || pickId(record.postId) || asBlog._id;
  const bookmarkId =
    pickId(record.bookmarkId) ||
    pickId(record._id) ||
    pickId(record.id) ||
    blogId;

  if (!blogId) return null;

  return {
    bookmarkId,
    blogId,
    blog: { ...asBlog, _id: blogId, id: blogId, isBookmarked: true },
    createdAt:
      (typeof record.createdAt === 'string' && record.createdAt) ||
      asBlog.publishedAt ||
      asBlog.createdAt ||
      undefined,
  };
}

function persistMappedUser(apiUser: ApiUser): AuthUser {
  const practiceAreas = sessionStore.getUser()?.practiceAreas ?? [];
  const user = mapApiUserToAuthUser(apiUser, practiceAreas);
  const token = sessionStore.getAccessToken();
  if (token) {
    sessionStore.persist(user, token, {
      refreshToken: sessionStore.getRefreshToken(),
    });
  }
  return user;
}

export const usersService = {
  async updateProfile(
    payload: UpdateProfilePayload,
  ): Promise<{ user: AuthUser; message: string }> {
    const response = await api.patch<UserEnvelope>(
      '/api/users/profile',
      {
        json: {
          fullName: payload.fullName.trim(),
          officeName: payload.officeName.trim(),
          barAssociationNumber: payload.barAssociationNumber.trim(),
          phone: payload.phone.trim(),
          teamSize: payload.teamSize,
        },
      },
      { auth: true },
    );

    return {
      user: persistMappedUser(response.data.user),
      message: response.message,
    };
  },

  async uploadAvatar(file: File): Promise<{ user: AuthUser; message: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<UserEnvelope>(
      '/api/users/profile/avatar',
      { formData },
      { auth: true },
    );

    return {
      user: persistMappedUser(response.data.user),
      message: response.message,
    };
  },

  async getBookmarks(page = 1, limit = 10): Promise<BlogBookmarksResult> {
    const response = await api.get<BookmarksEnvelope>(
      `/api/users/me/bookmarks?page=${page}&limit=${limit}`,
      { auth: true },
    );

    const data = response.data ?? {};
    const rawList = data.bookmarks ?? data.items ?? data.blogs ?? [];
    const bookmarks = (Array.isArray(rawList) ? rawList : [])
      .map(normalizeBookmark)
      .filter((item): item is BlogBookmark => Boolean(item));

    const pagination = data.pagination ?? {};
    return {
      bookmarks,
      pagination: {
        page: pagination.page ?? page,
        limit: pagination.limit ?? limit,
        total: pagination.total ?? bookmarks.length,
        pages: pagination.pages ?? (bookmarks.length > 0 ? 1 : 0),
      },
    };
  },

  /**
   * Remove a saved bookmark.
   * Prefer DELETE /api/users/me/bookmarks/:id (aligned with GET).
   * Fallback: toggle bookmark on the blog (known working endpoint).
   * Note: Postman lists DELETE /api/users/:bookmarkId which would risk user deletion — not used.
   */
  async removeBookmark(bookmark: Pick<BlogBookmark, 'bookmarkId' | 'blogId'>): Promise<string> {
    try {
      const response = await api.delete<null>(
        `/api/users/me/bookmarks/${bookmark.bookmarkId}`,
        { auth: true },
      );
      return response.message || 'تمت إزالة المقالة من المفضلة';
    } catch {
      const result = await blogsService.toggleBookmark(bookmark.blogId);
      if (result.bookmarked) {
        // Toggle accidentally re-added — toggle once more to force remove.
        await blogsService.toggleBookmark(bookmark.blogId);
      }
      return 'تمت إزالة المقالة من المفضلة';
    }
  },
};
