'use client';

import Link from 'next/link';
import { Clock3, Scale } from 'lucide-react';
import type { Blog } from '@/types/blog.types';
import { gazetteCopy as c } from '../../data/gazetteCopy';
import {
  formatBlogDate,
  getAuthorAvatar,
  getAuthorName,
  getBlogExcerpt,
  getBlogId,
  getCoverImage,
} from '../../lib/blogHelpers';
import { BlogAuthorAvatar, BlogCover } from './BlogMedia';

type Props = {
  blog: Blog;
  categoryLabel?: string;
  featured?: boolean;
  /** Base path for article links. Default: dashboard gazette. */
  hrefBase?: string;
};

export default function GazetteArticleCard({
  blog,
  categoryLabel,
  featured = false,
  hrefBase = '/dashboard/gazette',
}: Props) {
  const id = getBlogId(blog);
  const href = `${hrefBase.replace(/\/$/, '')}/${id}`;
  const cover = getCoverImage(blog);
  const authorName = getAuthorName(blog);
  const avatar = getAuthorAvatar(blog);
  const label = categoryLabel || blog.category;
  const excerpt = getBlogExcerpt(blog);

  if (featured) {
    return (
      <Link
        href={href}
        className="group flex flex-col overflow-hidden rounded-xl border border-[#c4c6cf] bg-white shadow-[0_4px_20px_rgba(26,54,93,0.05)] transition hover:border-brand/40 dark:border-white/10 dark:bg-card md:flex-row"
      >
        {/* In RTL: content on the right, cover on the left */}
        <div className="flex flex-1 flex-col justify-center p-5 text-start sm:p-6 md:p-7">
          <div className="mb-2 flex items-center gap-2 text-sm text-[#775a19]">
            <Scale className="h-3.5 w-3.5 shrink-0" />
            <span>{label}</span>
          </div>
          <h3 className="mb-3 text-2xl font-semibold leading-snug text-[#002045] dark:text-foreground sm:text-3xl">
            {blog.title}
          </h3>
          <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-[#43474e] dark:text-muted sm:text-base">
            {excerpt}
          </p>
          <div className="flex items-center justify-between gap-3 text-sm text-[#43474e] dark:text-muted">
            <div className="flex min-w-0 items-center gap-2">
              <BlogAuthorAvatar src={avatar} name={authorName} className="h-8 w-8" />
              <span className="truncate text-[#181c1e] dark:text-foreground">{authorName}</span>
            </div>
            <span className="shrink-0">{formatBlogDate(blog.publishedAt || blog.createdAt)}</span>
          </div>
        </div>
        <BlogCover
          src={cover}
          className="h-52 w-full shrink-0 md:h-auto md:min-h-[280px] md:w-[46%]"
          iconClassName="h-12 w-12 transition duration-500 group-hover:scale-105"
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#c4c6cf] bg-white shadow-[0_4px_20px_rgba(26,54,93,0.05)] transition hover:border-brand/40 dark:border-white/10 dark:bg-card"
    >
      <BlogCover
        src={cover}
        className="h-44 w-full shrink-0 sm:h-48"
        iconClassName="h-10 w-10 transition duration-500 group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col gap-1 p-4 text-start">
        <p className="text-sm text-[#775a19]">{label}</p>
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-[#002045] dark:text-foreground sm:text-xl">
          {blog.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[#43474e] dark:text-muted">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#c4c6cf] pt-3 text-sm text-[#43474e] dark:border-white/10 dark:text-muted">
          <div className="flex min-w-0 items-center gap-2">
            <BlogAuthorAvatar src={avatar} name={authorName} className="h-7 w-7" />
            <span className="truncate text-[#181c1e] dark:text-foreground">{authorName}</span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {c.readingTime(blog.readingTime || 1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
