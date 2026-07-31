'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, ImageIcon, Plus } from 'lucide-react';
import { Navbar, Footer } from '@/components/layouts';
import LoginRequiredModal from '@/components/common/LoginRequiredModal';
import { useLoginGate } from '@/hooks/useLoginGate';
import { toastApiError } from '@/lib/api/toast';
import { ROUTES } from '@/config/routes';
import { blogsService } from '@/services/blogs.service';
import type { Blog, BlogCategory, BlogPagination } from '@/types/blog.types';
import { gazetteCopy as c } from '@/modules/dashboard/data/gazetteCopy';
import { collectTags, getBlogId } from '@/modules/dashboard/lib/blogHelpers';
import GazetteArticleCard from '@/modules/dashboard/components/gazette/GazetteArticleCard';
import GazetteSidebar from '@/modules/dashboard/components/gazette/GazetteSidebar';

const PAGE_LIMIT = 20;

export default function PublicGazettePage() {
  const router = useRouter();
  const gate = useLoginGate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [pagination, setPagination] = useState<BlogPagination | null>(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const requestIdRef = useRef(0);

  const categoryLabel = useCallback(
    (value: string) => categories.find((item) => item.value === value)?.label || value,
    [categories],
  );

  const loadBlogs = useCallback(
    async (nextPage: number, append: boolean) => {
      const requestId = ++requestIdRef.current;
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      setError('');

      try {
        const result = await blogsService.list({
          page: nextPage,
          limit: PAGE_LIMIT,
          sort: 'newest',
          ...(category ? { category } : {}),
          ...(tag ? { tags: tag } : {}),
        });
        if (requestId !== requestIdRef.current) return;
        setBlogs((prev) => (append ? [...prev, ...result.blogs] : result.blogs));
        setPagination(result.pagination);
        setPage(nextPage);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        if (!append) {
          setBlogs([]);
          setError(err instanceof Error ? err.message : 'تعذر جلب المقالات');
        }
        toastApiError(err, 'تعذر جلب المقالات');
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [category, tag],
  );

  useEffect(() => {
    let active = true;
    void blogsService
      .getCategories()
      .then((list) => {
        if (active) setCategories(list);
      })
      .catch(() => {
        if (active) setCategories([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadBlogs(1, false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadBlogs, reloadKey]);

  const tags = useMemo(() => collectTags(blogs), [blogs]);
  const featured = blogs[0] || null;
  const rest = blogs.slice(1);
  const canLoadMore = pagination != null && pagination.page < pagination.pages;

  const goCreate = () => {
    gate.requireAuth(() => {
      router.push('/dashboard/gazette/create');
    });
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#f0f4ff] pt-24 pb-16 dark:bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8" dir="rtl">
          <section className="relative overflow-hidden rounded-xl bg-[#1a365d] px-5 py-8 text-white sm:px-8 sm:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_45%)] opacity-40" />
            <div className="relative flex max-w-2xl flex-col gap-3">
              <span className="w-fit rounded-sm bg-[#fed488] px-2 py-1 text-[11px] font-bold text-[#785a1a]">
                {c.eyebrow}
              </span>
              <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{c.title}</h1>
              <p className="text-sm leading-relaxed text-white/90 sm:text-base">{c.subtitle}</p>
              <button
                type="button"
                onClick={goCreate}
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#002045] transition hover:bg-[#fed488] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                {c.addArticle}
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="order-2 lg:order-1 lg:col-span-4 xl:col-span-3">
              <GazetteSidebar
                categories={categories}
                activeCategory={category}
                onCategoryChange={(value) => {
                  if (!value) {
                    setCategory('');
                    setTag('');
                    setReloadKey((k) => k + 1);
                    return;
                  }
                  setCategory(value);
                }}
                feedMode="latest"
                onFeedModeChange={() => undefined}
                showFeedModes={false}
                tags={tags}
                activeTag={tag}
                onTagChange={setTag}
                onConsult={() => {
                  gate.requireAuth(() => {
                    window.location.href = '/dashboard?view=consultation';
                  });
                }}
              />
            </div>

            <div className="order-1 space-y-5 lg:order-2 lg:col-span-8 xl:col-span-9">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className={`h-72 animate-pulse rounded-xl bg-white/80 dark:bg-white/5 ${n === 1 ? 'md:col-span-2' : ''}`}
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-xl border bg-white py-16 text-center dark:bg-card">
                  <p className="mb-4 font-bold text-danger">{error}</p>
                  <button
                    type="button"
                    onClick={() => void loadBlogs(1, false)}
                    className="text-xs font-bold underline cursor-pointer"
                  >
                    {c.retry}
                  </button>
                </div>
              ) : blogs.length === 0 ? (
                <div className="flex flex-col items-center rounded-xl border bg-white py-20 text-muted dark:bg-card">
                  <ImageIcon className="mb-4 h-12 w-12 opacity-40" />
                  <h2 className="text-lg font-bold text-foreground">{c.empty}</h2>
                </div>
              ) : (
                <>
                  {featured ? (
                    <GazetteArticleCard
                      blog={featured}
                      featured
                      hrefBase={ROUTES.gazette}
                      categoryLabel={categoryLabel(featured.category)}
                    />
                  ) : null}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {rest.map((blog) => (
                      <GazetteArticleCard
                        key={getBlogId(blog)}
                        blog={blog}
                        hrefBase={ROUTES.gazette}
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
                        className="inline-flex items-center gap-2 rounded-md border border-[#002045] px-8 py-3 text-sm font-bold text-[#002045] transition hover:bg-[#002045] hover:text-white disabled:opacity-50 cursor-pointer"
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

          <p className="text-center text-xs text-muted">
            <Link href={ROUTES.home} className="underline hover:text-brand">
              العودة للرئيسية
            </Link>
          </p>
        </div>
      </main>
      <Footer />

      <LoginRequiredModal
        open={gate.loginOpen}
        onCancel={gate.closeLoginGate}
        onConfirm={gate.confirmLogin}
      />
    </>
  );
}
