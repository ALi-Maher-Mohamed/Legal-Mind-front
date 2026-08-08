import { api } from '@/lib/api/client';
import type { BlogComment, BlogCommentsResult, BlogPagination } from '@/types/blog.types';

type CommentsResponse = {
  comments: BlogComment[];
  pagination: BlogPagination;
};

type CommentResponse = {
  comment: BlogComment;
  message?: string;
};

export const commentsService = {
  async list(blogId: string, page = 1, limit = 20): Promise<BlogCommentsResult> {
    const response = await api.get<CommentsResponse>(
      `/api/v1/blogs/${blogId}/comments?page=${page}&limit=${limit}`,
    );
    return {
      comments: response?.comments ?? [],
      pagination: response?.pagination ?? {
        page,
        limit,
        total: 0,
        pages: 0,
      },
    };
  },

  async create(
    blogId: string,
    content: string,
  ): Promise<{ comment: BlogComment; message?: string }> {
    const response = await api.post<CommentResponse>(
      `/api/v1/blogs/${blogId}/comments`,
      { json: { content } },
      { auth: true },
    );
    return { comment: response.comment, message: response.message };
  },

  async update(
    commentId: string,
    content: string,
  ): Promise<{ comment: BlogComment; message?: string }> {
    const response = await api.put<CommentResponse>(
      `/api/v1/comments/${commentId}`,
      { json: { content } },
      { auth: true },
    );
    return { comment: response.comment, message: response.message };
  },

  async remove(commentId: string): Promise<void> {
    await api.delete(`/api/v1/comments/${commentId}`, {
      auth: true,
    });
  },
};
