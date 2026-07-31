'use client';

import { BookMarked, Flame, Hash, Library, Newspaper } from 'lucide-react';
import type { BlogCategory } from '@/types/blog.types';
import { gazetteCopy as c } from '../../data/gazetteCopy';

type FeedMode = 'latest' | 'trending';

type Props = {
  categories: BlogCategory[];
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  feedMode: FeedMode;
  onFeedModeChange: (mode: FeedMode) => void;
  tags: string[];
  activeTag: string;
  onTagChange: (tag: string) => void;
  onConsult?: () => void;
};

export default function GazetteSidebar({
  categories,
  activeCategory,
  onCategoryChange,
  feedMode,
  onFeedModeChange,
  tags,
  activeTag,
  onTagChange,
  onConsult,
}: Props) {
  const navItem = (active: boolean) =>
    `flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition cursor-pointer ${
      active
        ? 'bg-[#fed488] font-bold text-[#002045]'
        : 'text-[#43474e] hover:bg-white/70 dark:text-muted dark:hover:bg-white/5'
    }`;

  return (
    <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-4">
      <div className="rounded-xl bg-[#f1f4f6] p-5 dark:bg-white/5">
        <div className="mb-4 flex items-center justify-end gap-2 border-e-4 border-[#002045] pe-3">
          <h4 className="text-sm font-bold uppercase tracking-wide text-[#002045] dark:text-foreground">
            {c.library}
          </h4>
          <Library className="h-4 w-4 text-[#002045] dark:text-foreground" />
        </div>
        <div className="space-y-1">
          <button type="button" className={navItem(feedMode === 'latest')} onClick={() => onFeedModeChange('latest')}>
            <Newspaper className="h-3.5 w-3.5" />
            <span>{c.latest}</span>
          </button>
          <button
            type="button"
            className={navItem(feedMode === 'trending')}
            onClick={() => onFeedModeChange('trending')}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>{c.trending}</span>
          </button>
        </div>

        <div className="mt-4 space-y-1 border-t border-[#c4c6cf]/70 pt-4 dark:border-white/10">
          <button
            type="button"
            className={navItem(!activeCategory)}
            onClick={() => onCategoryChange('')}
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>{c.allCategories}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              className={navItem(activeCategory === cat.value)}
              onClick={() => onCategoryChange(cat.value)}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {tags.length > 0 ? (
        <div className="rounded-xl bg-[#f1f4f6] p-5 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-end gap-2 border-e-4 border-[#002045] pe-3">
            <h4 className="text-sm font-bold uppercase tracking-wide text-[#002045] dark:text-foreground">
              {c.popularTags}
            </h4>
            <Hash className="h-4 w-4 text-[#002045] dark:text-foreground" />
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagChange(activeTag === tag ? '' : tag)}
                className={`rounded-full border px-3 py-1 text-sm transition cursor-pointer ${
                  activeTag === tag
                    ? 'border-[#002045] bg-[#002045] text-white'
                    : 'border-[#c4c6cf] bg-white text-[#43474e] hover:border-[#002045] dark:border-white/15 dark:bg-white/5 dark:text-muted'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-xl bg-[#002045] p-5 text-white">
        <div className="pointer-events-none absolute -bottom-10 -start-10 h-32 w-32 rounded-xl bg-[#775a19]/20 blur-2xl" />
        <h4 className="mb-2 text-end text-xl font-semibold">{c.consultCta}</h4>
        <p className="mb-4 text-end text-sm leading-relaxed text-white/80">
          احصل على دعم قانوني متخصص من مستشاري LegalMind.
        </p>
        <button
          type="button"
          onClick={onConsult}
          className="w-full rounded-md bg-[#fed488] py-3 text-sm font-bold text-[#785a1a] transition hover:opacity-90 cursor-pointer"
        >
          {c.consultCta}
        </button>
      </div>
    </aside>
  );
}
