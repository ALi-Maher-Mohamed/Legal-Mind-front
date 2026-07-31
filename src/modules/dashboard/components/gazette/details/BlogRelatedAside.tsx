'use client';

import Link from 'next/link';
import type { Blog } from '@/types/blog.types';
import { gazetteCopy as c } from '../../../data/gazetteCopy';
import {
  getAuthorAvatar,
  getAuthorName,
  getBlogId,
  getCoverImage,
} from '../../../lib/blogHelpers';
import { BlogAuthorAvatar, BlogCover } from '../BlogMedia';

type Props = {
  related: Blog[];
  tags?: string[];
  hrefBase?: string;
};

export default function BlogRelatedAside({
  related,
  tags,
  hrefBase = '/dashboard/gazette',
}: Props) {
  const base = hrefBase.replace(/\/$/, '');

  return (
    <aside className="space-y-4 lg:col-span-4">
      <div className="rounded-xl bg-[#f1f4f6] p-5 dark:bg-white/5">
        <h3 className="mb-4 border-s-4 border-[#002045] ps-3 text-sm font-bold uppercase text-[#002045] dark:text-foreground">
          {c.related}
        </h3>
        <div className="space-y-3">
          {related.length === 0 ? (
            <p className="text-sm text-muted">—</p>
          ) : (
            related.map((item) => {
              const itemAuthor = getAuthorName(item);
              return (
                <Link
                  key={getBlogId(item)}
                  href={`${base}/${getBlogId(item)}`}
                  className="flex items-center gap-3 rounded-lg bg-white p-2 transition hover:shadow-sm dark:bg-white/5"
                >
                  <BlogCover
                    src={getCoverImage(item)}
                    className="h-14 w-14 shrink-0 rounded-md"
                    iconClassName="h-5 w-5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-[#002045] dark:text-foreground">
                      {item.title}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <BlogAuthorAvatar
                        src={getAuthorAvatar(item)}
                        name={itemAuthor}
                        className="h-5 w-5"
                        textClassName="text-[8px]"
                        iconClassName="h-2.5 w-2.5"
                      />
                      <span className="truncate text-xs text-muted">{itemAuthor}</span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {tags?.length ? (
        <div className="rounded-xl bg-[#f1f4f6] p-5 dark:bg-white/5">
          <h3 className="mb-4 border-s-4 border-[#002045] ps-3 text-sm font-bold uppercase text-[#002045] dark:text-foreground">
            {c.tags}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#c4c6cf] bg-white px-3 py-1 text-sm text-[#43474e] dark:border-white/15 dark:bg-white/5 dark:text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <Link
        href="/dashboard?view=consultation"
        className="flex w-full items-center justify-center rounded-xl bg-[#002045] px-4 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
      >
        {c.consultCta}
      </Link>
    </aside>
  );
}
