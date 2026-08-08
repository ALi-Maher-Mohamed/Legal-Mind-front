import { api } from '@/lib/api/client';
import { sessionStore } from '@/lib/api/session';
import { mapApiUserToAuthUser } from '@/modules/auth/lib/mapAuthUser';
import type { AuthUser, PublicUser, UpdateProfilePayload } from '@/types/auth.types';
import type { Blog, BlogBookmark, BlogBookmarksResult, BlogPagination } from '@/types/blog.types';

type ProfileResponse = { message?: string; user: PublicUser };

type BookmarksResponse = {
  bookmarks?: unknown[];
  pagination?: Partial<BlogPagination>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function pickString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function pickId(value: unknown): string {
  const record = asRecord(value);
  if (!record) return typeof value === 'string' ? value : '';
  return String(record.id || record._id || '');
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

  const nestedBlog = coerceBlog(record.blog);
  if (!nestedBlog) return null;

  const blogId =
    pickString(record.blog_id) ||
    pickId(record.blogId) ||
    nestedBlog.id ||
    nestedBlog._id;
  const bookmarkId =
    pickString(record.bookmark_id) ||
    pickId(record.bookmarkId) ||
    pickId(record);

  if (!blogId || !bookmarkId) return null;

  return {
    bookmarkId,
    blogId,
    blog: { ...nestedBlog, _id: blogId, id: blogId, isBookmarked: true },
    createdAt:
      pickString(record.created_at) ||
      pickString(record.createdAt) ||
      nestedBlog.publishedAt ||
      nestedBlog.createdAt ||
      undefined,
  };
}

function persistMappedUser(apiUser: PublicUser): AuthUser {
  const practiceAreas = sessionStore.getUser()?.practiceAreas ?? [];
  const user = mapApiUserToAuthUser(apiUser, practiceAreas);
  const token = sessionStore.getAccessToken();
  if (token) {
    sessionStore.persist(user, token);
  } else {
    sessionStore.updateUser(user);
  }
  return user;
}

export const usersService = {
  async updateProfile(
    payload: UpdateProfilePayload,
  ): Promise<{ user: AuthUser; message?: string }> {
    const response = await api.patch<ProfileResponse>(
      '/api/v1/users/profile',
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
      user: persistMappedUser(response.user),
      message: response.message,
    };
  },

  async uploadAvatar(file: File): Promise<{ user: AuthUser; message?: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<ProfileResponse>(
      '/api/v1/users/profile/avatar',
      { formData },
      { auth: true },
    );

    return {
      user: persistMappedUser(response.user),
      message: response.message,
    };
  },

  async getBookmarks(page = 1, limit = 10): Promise<BlogBookmarksResult> {
    const response = await api.get<BookmarksResponse>(
      `/api/v1/users/me/bookmarks?page=${page}&limit=${limit}`,
      { auth: true },
    );

    const rawList = response.bookmarks ?? [];
    const bookmarks = (Array.isArray(rawList) ? rawList : [])
      .map(normalizeBookmark)
      .filter((item): item is BlogBookmark => Boolean(item));

    const pagination = response.pagination ?? {};
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

  async removeBookmark(bookmark: Pick<BlogBookmark, 'bookmarkId'>): Promise<string> {
    await api.delete(`/api/v1/users/me/bookmarks/${bookmark.bookmarkId}`, {
      auth: true,
    });
    return 'تمت إزالة المقالة من المفضلة';
  },
};
