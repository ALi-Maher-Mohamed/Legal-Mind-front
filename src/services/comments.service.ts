import { api } from '@/lib/api/client';
import type { BlogComment, BlogCommentsResult, BlogPagination } from '@/types/blog.types';

type CommentsEnvelope = {
  comments: BlogComment[];
  pagination: BlogPagination;
};

type CommentEnvelope = {
  comment: BlogComment;
};

export const commentsService = {
  async list(blogId: string, page = 1, limit = 20): Promise<BlogCommentsResult> {
    const response = await api.get<CommentsEnvelope>(
      `/api/blogs/${blogId}/comments?page=${page}&limit=${limit}`,
    );
    return {
      comments: response.data?.comments ?? [],
      pagination: response.data?.pagination ?? {
        page,
        limit,
        total: 0,
        pages: 0,
      },
    };
  },

  async create(blogId: string, content: string): Promise<BlogComment> {
    const response = await api.post<CommentEnvelope>(
      `/api/blogs/${blogId}/comments`,
      { json: { content } },
      { auth: true },
    );
    return response.data.comment;
  },

  async update(commentId: string, content: string): Promise<BlogComment> {
    const response = await api.put<CommentEnvelope>(
      `/api/comments/${commentId}`,
      { json: { content } },
      { auth: true },
    );
    return response.data.comment;
  },

  async remove(commentId: string): Promise<string> {
    const response = await api.delete<null>(`/api/comments/${commentId}`, {
      auth: true,
    });
    return response.message || 'تم حذف التعليق بنجاح';
  },
};
