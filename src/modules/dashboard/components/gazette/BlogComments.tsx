'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { sessionStore } from '@/lib/api/session';
import { resolveMediaUrl } from '@/lib/api/media';
import { commentsService } from '@/services/comments.service';
import type { BlogComment } from '@/types/blog.types';
import { gazetteCopy as c } from '../../data/gazetteCopy';
import {
  formatBlogDate,
  getCommentAuthorAvatar,
  getCommentAuthorId,
  getCommentAuthorName,
  getCommentId,
} from '../../lib/blogHelpers';
import { BlogAuthorAvatar } from './BlogMedia';

type Props = {
  blogId: string;
  /** When guest tries to comment — show login gate instead of hint only */
  onRequireLogin?: () => void;
};

export default function BlogComments({ blogId, onRequireLogin }: Props) {
  const currentUser = sessionStore.getUser();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(
    async (nextPage: number, append: boolean) => {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      setError('');

      try {
        const result = await commentsService.list(blogId, nextPage, 20);
        setComments((prev) =>
          append ? [...prev, ...result.comments] : result.comments,
        );
        setPage(result.pagination.page);
        setTotal(result.pagination.total);
        setHasMore(result.pagination.page < result.pagination.pages);
      } catch (err) {
        if (!append) {
          setComments([]);
          setError(err instanceof Error ? err.message : '');
        }
        toastApiError(err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [blogId],
  );

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) void load(1, false);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const handleCreate = async () => {
    const content = draft.trim();
    if (!content || isSubmitting) return;
    if (!currentUser) {
      onRequireLogin?.();
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await commentsService.create(blogId, content);
      setDraft('');
      toastApiSuccess(result.message);
      await load(1, false);
    } catch (err) {
      toastApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (commentId: string) => {
    const content = editDraft.trim();
    if (!content || busyId) return;
    setBusyId(commentId);
    try {
      const result = await commentsService.update(commentId, content);
      const updated = result.comment;
      setComments((prev) =>
        prev.map((item) => {
          if (getCommentId(item) !== commentId) return item;
          return {
            ...item,
            ...updated,
            // Keep populated author from list if update returns only author id
            author:
              typeof updated.author === 'string' || !updated.author
                ? item.author
                : updated.author,
          };
        }),
      );
      setEditingId(null);
      setEditDraft('');
      toastApiSuccess(result.message);
    } catch (err) {
      toastApiError(err);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm(c.commentDeleteConfirm) || busyId) return;
    setBusyId(commentId);
    try {
      await commentsService.remove(commentId);
      setComments((prev) => prev.filter((item) => getCommentId(item) !== commentId));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toastApiError(err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="mt-8 border-t border-[#e5e8ee] pt-6 dark:border-white/10" dir="rtl">
      <div className="mb-5 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-[#002045] dark:text-foreground" />
        <h2 className="text-lg font-bold text-[#002045] dark:text-foreground">
          {c.comments}
        </h2>
        <span className="rounded-full bg-[#002045]/8 px-2.5 py-0.5 text-xs font-semibold text-[#002045] dark:bg-white/10 dark:text-foreground">
          {c.commentsCount(total)}
        </span>
      </div>

      <div className="mb-6 rounded-xl border border-[#c4c6cf] bg-[#f8fafc] p-4 dark:border-white/10 dark:bg-white/5">
        {currentUser ? (
          <>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder={c.commentPlaceholder}
              className="w-full resize-y rounded-lg border border-[#c4c6cf] bg-white px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-[#002045] dark:border-white/15 dark:bg-card"
            />
            <div className="mt-3 flex justify-start">
              <button
                type="button"
                disabled={isSubmitting || !draft.trim()}
                onClick={() => void handleCreate()}
                className="rounded-lg bg-[#002045] px-5 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? c.commentSubmitting : c.commentSubmit}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">{c.commentLoginHint}</p>
            {onRequireLogin ? (
              <button
                type="button"
                onClick={onRequireLogin}
                className="rounded-lg bg-[#002045] px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 cursor-pointer"
              >
                {c.commentSubmit}
              </button>
            ) : null}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="h-20 animate-pulse rounded-xl bg-[#e8eef8] dark:bg-white/5" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-dashed border-danger/30 py-8 text-center">
          <p className="mb-2 text-sm font-semibold text-danger">{error}</p>
          <button
            type="button"
            onClick={() => void load(1, false)}
            className="text-xs font-bold text-[#002045] underline cursor-pointer dark:text-foreground"
          >
            {c.commentsRetry}
          </button>
        </div>
      ) : comments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#c4c6cf] py-8 text-center text-sm text-muted dark:border-white/15">
          {c.commentsEmpty}
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => {
            const id = getCommentId(comment);
            const name = getCommentAuthorName(comment);
            const avatar = getCommentAuthorAvatar(comment);
            const isOwner = Boolean(currentUser?.id) && currentUser?.id === getCommentAuthorId(comment);
            const isEditing = editingId === id;

            return (
              <li
                key={id}
                className="rounded-xl border border-[#c4c6cf] bg-white p-4 dark:border-white/10 dark:bg-card"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <BlogAuthorAvatar
                      src={
                        avatar ||
                        (isOwner ? resolveMediaUrl(currentUser?.avatarUrl) : null)
                      }
                      name={isOwner ? currentUser?.name || name : name}
                      className="h-9 w-9"
                      textClassName="text-[10px]"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#002045] dark:text-foreground">
                        {isOwner ? currentUser?.name || name : name}
                      </p>
                      <p className="text-xs text-muted">{formatBlogDate(comment.createdAt)}</p>
                    </div>
                  </div>

                  {isOwner ? (
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        disabled={busyId === id}
                        onClick={() => {
                          setEditingId(id);
                          setEditDraft(comment.content);
                        }}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted transition hover:bg-[#f1f4f6] hover:text-[#002045] cursor-pointer dark:hover:bg-white/5"
                      >
                        <Pencil className="h-3 w-3" />
                        {c.commentEdit}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === id}
                        onClick={() => void handleDelete(id)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-danger transition hover:bg-danger/5 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        {c.commentDelete}
                      </button>
                    </div>
                  ) : null}
                </div>

                {isEditing ? (
                  <div>
                    <textarea
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      rows={3}
                      className="w-full resize-y rounded-lg border border-[#c4c6cf] bg-[#f8fafc] px-3 py-2 text-sm outline-none focus:border-[#002045] dark:border-white/15 dark:bg-white/5"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        disabled={busyId === id || !editDraft.trim()}
                        onClick={() => void handleUpdate(id)}
                        className="rounded-md bg-[#002045] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
                      >
                        {c.commentSave}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditDraft('');
                        }}
                        className="rounded-md border border-[#c4c6cf] px-3 py-1.5 text-xs font-bold text-muted cursor-pointer dark:border-white/15"
                      >
                        {c.commentCancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#1f2937] dark:text-foreground/90">
                    {comment.content}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {hasMore ? (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            disabled={isLoadingMore}
            onClick={() => void load(page + 1, true)}
            className="rounded-lg border border-[#002045] px-5 py-2 text-xs font-bold text-[#002045] transition hover:bg-[#002045] hover:text-white disabled:opacity-50 cursor-pointer dark:border-white dark:text-white"
          >
            {c.commentsMore}
          </button>
        </div>
      ) : null}
    </section>
  );
}
