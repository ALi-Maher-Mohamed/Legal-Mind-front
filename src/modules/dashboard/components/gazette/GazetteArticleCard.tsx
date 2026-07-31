"use client";

import Link from "next/link";
import { Clock3, Scale, UserRound } from "lucide-react";
import type { Blog } from "@/types/blog.types";
import { gazetteCopy as c } from "../../data/gazetteCopy";
import {
  formatBlogDate,
  getAuthorAvatar,
  getAuthorName,
  getBlogId,
  getCoverImage,
} from "../../lib/blogHelpers";

type Props = {
  blog: Blog;
  categoryLabel?: string;
  featured?: boolean;
};

export default function GazetteArticleCard({
  blog,
  categoryLabel,
  featured = false,
}: Props) {
  const id = getBlogId(blog);
  const cover = getCoverImage(blog);
  const authorName = getAuthorName(blog);
  const avatar = getAuthorAvatar(blog);
  const label = categoryLabel || blog.category;

  if (featured) {
    return (
      <Link
        href={`/dashboard/gazette/${id}`}
        className="group flex flex-col overflow-hidden rounded-xl border border-[#c4c6cf] bg-white shadow-[0_4px_20px_rgba(26,54,93,0.05)] transition hover:border-brand/40 dark:border-white/10 dark:bg-card md:flex-row"
      >
        <div className="order-2 flex flex-1 flex-col justify-center p-5 sm:p-6 md:order-1 md:p-7">
          <div className="mb-2 flex items-center justify-end gap-2 text-sm text-[#775a19]">
            <span>{label}</span>
            <Scale className="h-3.5 w-3.5" />
          </div>
          <h3 className="mb-3 text-end text-2xl font-semibold leading-snug text-[#002045] dark:text-foreground sm:text-3xl">
            {blog.title}
          </h3>
          <p className="mb-6 line-clamp-3 text-end text-sm leading-relaxed text-[#43474e] dark:text-muted sm:text-base">
            {blog.excerpt || blog.content}
          </p>
          <div className="flex items-center justify-between gap-3 text-sm text-[#43474e] dark:text-muted">
            <span>{formatBlogDate(blog.publishedAt || blog.createdAt)}</span>
            <div className="flex items-center gap-2">
              <span className="text-[#181c1e] dark:text-foreground">
                {authorName}
              </span>
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#ebeef0] dark:bg-white/10">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-3.5 w-3.5 text-muted" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 relative h-52 w-full shrink-0 bg-[#e8eef8] md:order-2 md:h-auto md:min-h-[280px] md:w-[46%]">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#002045] to-brand">
              <Scale className="h-12 w-12 text-white/30" />
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/dashboard/gazette/${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#c4c6cf] bg-white shadow-[0_4px_20px_rgba(26,54,93,0.05)] transition hover:border-brand/40 dark:border-white/10 dark:bg-card"
    >
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-[#e8eef8] sm:h-48">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#002045] to-brand">
            <Scale className="h-10 w-10 text-white/30" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-end text-sm text-[#775a19]">{label}</p>
        <h3 className="line-clamp-2 text-end text-lg font-semibold leading-snug text-[#002045] dark:text-foreground sm:text-xl">
          {blog.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-end text-sm leading-relaxed text-[#43474e] dark:text-muted">
          {blog.excerpt || blog.content}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#c4c6cf] pt-3 text-sm text-[#43474e] dark:border-white/10 dark:text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {c.readingTime(blog.readingTime || 1)}
          </span>
          <span className="truncate text-[#181c1e] dark:text-foreground">
            {authorName}
          </span>
        </div>
      </div>
    </Link>
  );
}
