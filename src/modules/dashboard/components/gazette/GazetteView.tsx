'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ImageIcon, Plus } from 'lucide-react';
import { toastApiError } from '@/lib/api/toast';
import { blogsService } from '@/services/blogs.service';
import type { Blog, BlogCategory, BlogPagination } from '@/types/blog.types';
import { gazetteCopy as c } from '../../data/gazetteCopy';
import { collectTags } from '../../lib/blogHelpers';
import GazetteArticleCard from './GazetteArticleCard';
import GazetteSidebar from './GazetteSidebar';

type FeedMode = 'latest' | 'trending';

export default function GazetteView() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [pagination, setPagination] = useState<BlogPagination | null>(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [feedMode, setFeedMode] = useState<FeedMode>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const categoryLabel = useCallback(
    (value: string) => categories.find((item) => item.value === value)?.label || value,
    [categories],
  );

  const loadBlogs = useCallback(
    async (nextPage: number, append: boolean) => {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      setError('');

      try {
        if (feedMode === 'trending' && nextPage === 1 && !append) {
          const trending = await blogsService.getTrending(12);
          const filtered = trending.filter((blog) => {
            const byCategory = !category || blog.category === category;
            const byTag = !tag || (blog.tags || []).includes(tag);
            return byCategory && byTag;
          });
          setBlogs(filtered);
          setPagination({
            page: 1,
            limit: filtered.length,
            total: filtered.length,
            pages: 1,
          });
          return;
        }

        const result = await blogsService.list({
          page: nextPage,
          limit: 9,
          sort: 'newest',
          category: category || undefined,
          tags: tag || undefined,
        });

        setBlogs((prev) => (append ? [...prev, ...result.blogs] : result.blogs));
        setPagination(result.pagination);
        setPage(nextPage);
      } catch (err) {
        if (!append) {
          setBlogs([]);
          setError(err instanceof Error ? err.message : 'تعذر جلب المقالات');
        }
        toastApiError(err, 'تعذر جلب المقالات');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [category, feedMode, tag],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await blogsService.getCategories();
        if (!cancelled) setCategories(list);
      } catch {
        if (!cancelled) setCategories([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) void loadBlogs(1, false);
    });
    return () => {
      cancelled = true;
    };
  }, [loadBlogs]);

  const tags = useMemo(() => collectTags(blogs), [blogs]);
  const featured = blogs[0] || null;
  const rest = blogs.slice(1);
  const canLoadMore =
    feedMode === 'latest' && pagination != null && pagination.page < pagination.pages;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-10 text-start" dir="rtl">
      <section className="relative overflow-hidden rounded-xl bg-[#1a365d] px-5 py-8 text-white sm:px-8 sm:py-10 md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_45%)] opacity-40" />
        <div className="relative flex max-w-2xl flex-col gap-3">
          <span className="w-fit rounded-sm bg-[#fed488] px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-[#785a1a]">
            {c.eyebrow}
          </span>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{c.title}</h1>
          <p className="text-sm leading-relaxed text-white/90 sm:text-base">{c.subtitle}</p>
          <Link
            href="/dashboard/gazette/create"
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#002045] transition hover:bg-[#fed488]"
          >
            <Plus className="h-4 w-4" />
            {c.addArticle}
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Mobile: content first. Desktop RTL: sidebar on the right via order */}
        <div className="order-2 lg:order-1 lg:col-span-4 xl:col-span-3">
          <GazetteSidebar
            categories={categories}
            activeCategory={category}
            onCategoryChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
            feedMode={feedMode}
            onFeedModeChange={(mode) => {
              setFeedMode(mode);
              setPage(1);
            }}
            tags={tags}
            activeTag={tag}
            onTagChange={(value) => {
              setTag(value);
              setPage(1);
            }}
            onConsult={() => {
              window.location.href = '/dashboard?view=consultation';
            }}
          />
        </div>

        <div className="order-1 space-y-5 lg:order-2 lg:col-span-8 xl:col-span-9">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-72 animate-pulse rounded-xl bg-[#e8eef8] dark:bg-white/5 ${n === 1 ? 'md:col-span-2' : ''}`}
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[#c4c6cf] bg-white py-16 text-center dark:border-white/10 dark:bg-card">
              <p className="mb-4 font-bold text-danger">{error}</p>
              <button
                type="button"
                onClick={() => void loadBlogs(1, false)}
                className="text-xs font-bold uppercase tracking-wider text-muted underline cursor-pointer"
              >
                {c.retry}
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#c4c6cf] bg-white py-20 text-muted dark:border-white/10 dark:bg-card">
              <ImageIcon className="mb-4 h-12 w-12 opacity-40" />
              <h2 className="mb-1 text-lg font-bold text-foreground">{c.empty}</h2>
              <p className="text-xs uppercase tracking-wider">{c.emptyHint}</p>
            </div>
          ) : (
            <>
              {featured ? (
                <GazetteArticleCard
                  blog={featured}
                  featured
                  categoryLabel={categoryLabel(featured.category)}
                />
              ) : null}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {rest.map((blog) => (
                  <GazetteArticleCard
                    key={blog._id}
                    blog={blog}
                    categoryLabel={categoryLabel(blog.category)}
                  />
                ))}
              </div>

              {canLoadMore ? (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    disabled={isLoadingMore}
                    onClick={() => void loadBlogs(page + 1, true)}
                    className="inline-flex items-center gap-2 rounded-md border border-[#002045] px-8 py-3 text-sm font-bold text-[#002045] transition hover:bg-[#002045] hover:text-white disabled:opacity-50 dark:border-white dark:text-white cursor-pointer"
                  >
                    {c.loadMore}
                    <ChevronDown className={`h-4 w-4 ${isLoadingMore ? 'animate-bounce' : ''}`} />
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
