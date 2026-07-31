export type BlogStatus = 'draft' | 'pending' | 'published' | 'rejected';

export type BlogAuthor = {
  _id: string;
  id?: string;
  fullName?: string;
  displayName?: string;
  email?: string;
  officeName?: string;
  teamSize?: string;
  avatar?: string | null;
};

export type Blog = {
  _id: string;
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string | null;
  category: string;
  tags: string[];
  author: BlogAuthor | string | null;
  status: BlogStatus | string;
  views: number;
  bookmarksCount: number;
  likesCount: number;
  isBookmarked?: boolean;
  readingTime?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type BlogCategory = {
  value: string;
  label: string;
};

export type BlogPagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type BlogListParams = {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'popular';
  search?: string;
  category?: string;
  tags?: string;
};

export type BlogListResult = {
  blogs: Blog[];
  pagination: BlogPagination;
};

export type CreateBlogPayload = {
  title: string;
  content: string;
  category: string;
  coverImage?: string;
  tags?: string[];
  status?: BlogStatus | string;
};

export type UpdateBlogPayload = Partial<CreateBlogPayload>;

export type BookmarkResult = {
  bookmarked: boolean;
  action: 'added' | 'removed' | string;
};
