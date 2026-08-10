'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, BookmarkX, ChevronDown, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toastApiError } from '@/lib/api/toast';
import { usersService } from '@/services/users.service';
import type { BlogBookmark } from '@/types/blog.types';
import {
  formatBlogDate,
  getAuthorName,
  getCoverImage,
} from '../../lib/blogHelpers';
import { BlogCover } from '../gazette/BlogMedia';
import { profileCard, profileHeading, profileMuted } from './lib/profileStyles';

export default function ProfileBookmarksCard() {
  const { t } = useLanguage();
  const [items, setItems] = useState<BlogBookmark[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async (nextPage: number, append: boolean) => {
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);
    setError('');

    try {
      const result = await usersService.getBookmarks(nextPage, 6);
      setItems((prev) => (append ? [...prev, ...result.bookmarks] : result.bookmarks));
      setPage(result.pagination.page);
      setHasMore(result.pagination.page < result.pagination.pages);
    } catch (err) {
      if (!append) {
        setItems([]);
        setError(err instanceof Error ? err.message : '');
      }
      toastApiError(err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) void load(1, false);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const handleRemove = async (item: BlogBookmark) => {
    if (removingId) return;
    setRemovingId(item.bookmarkId);
    try {
      await usersService.removeBookmark(item);
      setItems((prev) => prev.filter((row) => row.bookmarkId !== item.bookmarkId));
    } catch (err) {
      toastApiError(err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className={profileCard} dir="rtl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-[rgba(77,126,247,0.12)] dark:text-[#7ba1f9]">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <h2 className={profileHeading}>{t.dashboard.profileBookmarks}</h2>
            <p className={`mt-0.5 ${profileMuted}`}>{t.dashboard.profileBookmarksHint}</p>
          </div>
        </div>
        <Link
          href="/dashboard?view=gazette"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand transition hover:brightness-110 dark:text-[#7ba1f9]"
        >
          {t.dashboard.profileBookmarksBrowse}
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-24 animate-pulse rounded-xl bg-brand/5 dark:bg-white/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-dashed border-danger/30 bg-danger/5 px-4 py-10 text-center">
          <p className="mb-3 text-sm font-semibold text-danger">{error}</p>
          <button
            type="button"
            onClick={() => void load(1, false)}
            className="text-sm font-bold text-brand underline cursor-pointer dark:text-[#7ba1f9]"
          >
            {t.dashboard.profileBookmarksRetry}
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/20 bg-[#e8eefc]/60 px-4 py-12 text-center dark:border-white/15 dark:bg-[#16223c]/40">
          <Bookmark className="mb-3 h-8 w-8 text-muted opacity-50" />
          <p className="mb-1 text-sm font-semibold text-foreground dark:text-[#e6edfc]">
            {t.dashboard.profileBookmarksEmpty}
          </p>
          <p className={profileMuted}>{t.dashboard.profileBookmarksEmptyHint}</p>
          <Link
            href="/dashboard?view=gazette"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 dark:bg-[#4d7ef7] dark:text-[#f4f7ff]"
          >
            {t.dashboard.profileBookmarksBrowse}
          </Link>
        </div>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => {
              const cover = getCoverImage(item.blog);
              const authorName = getAuthorName(item.blog);
              return (
                <li
                  key={item.bookmarkId}
                  className="flex gap-3 rounded-xl border border-brand/10 bg-[#f7f9ff] p-3 transition hover:border-brand/25 dark:border-white/10 dark:bg-[#0d1528]"
                >
                  <Link
                    href={`/dashboard/gazette/${item.blogId}`}
                    className="flex min-w-0 flex-1 gap-3 text-start"
                  >
                    <BlogCover
                      src={cover}
                      className="h-16 w-16 shrink-0 rounded-lg"
                      iconClassName="h-5 w-5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground dark:text-[#e6edfc]">
                        {item.blog.title}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted dark:text-[#9dabc9]">
                        {item.blog.category || authorName}
                        {' · '}
                        {formatBlogDate(item.createdAt || item.blog.publishedAt || item.blog.createdAt)}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    disabled={removingId === item.bookmarkId}
                    onClick={() => void handleRemove(item)}
                    title={t.dashboard.profileBookmarkRemove}
                    aria-label={t.dashboard.profileBookmarkRemove}
                    className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-lg border border-brand/10 text-muted transition hover:border-danger/30 hover:bg-danger/5 hover:text-danger disabled:opacity-50 cursor-pointer dark:border-white/10"
                  >
                    <BookmarkX className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>

          {hasMore ? (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                disabled={isLoadingMore}
                onClick={() => void load(page + 1, true)}
                className="inline-flex items-center gap-2 rounded-lg border border-brand/20 px-5 py-2 text-sm font-bold text-brand transition hover:bg-brand/5 disabled:opacity-50 cursor-pointer dark:border-white/15 dark:text-[#7ba1f9]"
              >
                {t.dashboard.profileBookmarksMore}
                <ChevronDown className={`h-4 w-4 ${isLoadingMore ? 'animate-bounce' : ''}`} />
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
