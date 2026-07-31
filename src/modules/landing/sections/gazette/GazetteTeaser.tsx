'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import { blogsService } from '@/services/blogs.service';
import type { Blog } from '@/types/blog.types';
import {
  formatBlogDate,
  getBlogExcerpt,
  getBlogId,
  getCoverImage,
} from '@/modules/dashboard/lib/blogHelpers';
import { BlogCover } from '@/modules/dashboard/components/gazette/BlogMedia';
import { fadeUpCard, staggerContainer } from '../../lib/motionVariants';

export default function GazetteTeaser() {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    void blogsService
      .list({ page: 1, limit: 3, sort: 'newest' })
      .then((result) => {
        if (active) setBlogs(result.blogs);
      })
      .catch(() => {
        if (active) setBlogs([]);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="gazette" className="relative scroll-mt-20 overflow-hidden bg-[#f0f4ff] py-20 dark:bg-[#0b1326]">
      <div className="pointer-events-none absolute -start-20 top-10 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -end-16 bottom-0 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />

      <div className="lm-container relative z-10" dir="rtl">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-[#002045] px-2.5 py-1 text-[11px] font-bold text-[#fed488]">
              <Newspaper className="h-3.5 w-3.5" />
              {t.gazetteLanding.badge}
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#002045] dark:text-foreground sm:text-3xl md:text-4xl">
              {t.gazetteLanding.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#43474e] dark:text-muted sm:text-base">
              {t.gazetteLanding.subtitle}
            </p>
          </div>

          <Link
            href={ROUTES.gazette}
            className="inline-flex items-center gap-2 rounded-xl bg-[#002045] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            {t.gazetteLanding.cta}
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {!loaded ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 animate-pulse rounded-2xl bg-white/80 dark:bg-white/5" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand/20 bg-white/70 px-6 py-14 text-center dark:bg-white/5">
            <p className="text-sm text-muted">{t.gazetteLanding.empty}</p>
            <Link
              href={ROUTES.gazette}
              className="mt-4 inline-flex text-sm font-bold text-brand underline"
            >
              {t.gazetteLanding.cta}
            </Link>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {blogs.map((blog) => {
              const id = getBlogId(blog);
              return (
                <motion.div key={id} variants={fadeUpCard}>
                  <Link
                    href={ROUTES.gazetteArticle(id)}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-[0_8px_30px_rgba(0,32,69,0.06)] transition hover:border-brand/30 dark:border-white/10 dark:bg-card"
                  >
                    <BlogCover
                      src={getCoverImage(blog)}
                      className="h-40 w-full"
                      iconClassName="h-9 w-9"
                    />
                    <div className="flex flex-1 flex-col gap-2 p-4 text-start">
                      <p className="text-xs font-semibold text-[#775a19]">{blog.category}</p>
                      <h3 className="line-clamp-2 text-lg font-bold text-[#002045] dark:text-foreground">
                        {blog.title}
                      </h3>
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted">
                        {getBlogExcerpt(blog, 100)}
                      </p>
                      <p className="mt-auto pt-2 text-xs text-muted">
                        {formatBlogDate(blog.publishedAt || blog.createdAt)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
