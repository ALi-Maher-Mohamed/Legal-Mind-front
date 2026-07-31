'use client';

import { looksLikeHtml } from '../../../lib/blogHelpers';
import { BlogCover } from '../BlogMedia';

type Props = {
  title: string;
  content: string;
  cover: string | null;
  tags?: string[];
};

export default function BlogDetailsBody({ title, content, cover, tags }: Props) {
  return (
    <>
      {cover ? (
        <BlogCover
          src={cover}
          alt={title}
          className="mb-8 h-52 w-full rounded-lg sm:h-64 md:h-72"
          iconClassName="h-14 w-14"
        />
      ) : null}

      {looksLikeHtml(content) ? (
        <div
          className="contract-editor-prose blog-article-prose text-[#1f2937] dark:text-foreground/90"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className="whitespace-pre-wrap text-base leading-[2] text-[#1f2937] dark:text-foreground/90">
          {content}
        </div>
      )}

      {tags?.length ? (
        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#c4c6cf] px-3 py-1 text-xs text-[#43474e] dark:border-white/15 dark:text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}
