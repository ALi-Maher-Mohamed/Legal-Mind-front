'use client';

import { CalendarDays, Clock3 } from 'lucide-react';
import type { BlogAuthor } from '@/types/blog.types';
import { gazetteCopy as c } from '../../../data/gazetteCopy';
import { formatBlogDate } from '../../../lib/blogHelpers';
import { BlogAuthorAvatar } from '../BlogMedia';

type Props = {
  authorName: string;
  avatar: string | null;
  author: BlogAuthor | null;
  date?: string;
  readingTime?: number;
  views: number;
};

export default function BlogDetailsMeta({
  authorName,
  avatar,
  author,
  date,
  readingTime,
  views,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-[#e5e8ee] pb-5 text-sm text-[#43474e] dark:border-white/10 dark:text-muted">
      <div className="flex items-center gap-2">
        <BlogAuthorAvatar
          src={avatar}
          name={authorName}
          className="h-10 w-10"
          textClassName="text-xs"
          iconClassName="h-4 w-4"
        />
        <div>
          <p className="font-semibold text-[#181c1e] dark:text-foreground">{authorName}</p>
          {author?.officeName ? (
            <p className="text-xs text-muted">{author.officeName}</p>
          ) : null}
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" />
        {formatBlogDate(date)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="h-3.5 w-3.5" />
        {c.readingTime(readingTime || 1)}
      </span>
      <span>{c.views(views || 0)}</span>
    </div>
  );
}
