'use client';

import type { BlogCategory } from '@/types/blog.types';
import { gazetteCopy as c } from '../../../data/gazetteCopy';
import { gazetteInputClass, gazetteLabelClass } from '../lib/formStyles';

type Props = {
  category: string;
  status: 'published' | 'draft';
  tags: string;
  categories: BlogCategory[];
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: 'published' | 'draft') => void;
  onTagsChange: (value: string) => void;
};

function StatusButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition cursor-pointer ${
        active
          ? 'border-[#002045] bg-[#002045] text-white'
          : 'border-[#c4c6cf] bg-white text-[#43474e] hover:border-[#002045] dark:border-white/15 dark:bg-white/5 dark:text-muted'
      }`}
    >
      {label}
    </button>
  );
}

export default function CreateBlogMetaPanel({
  category,
  status,
  tags,
  categories,
  onCategoryChange,
  onStatusChange,
  onTagsChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-[#c4c6cf] bg-white p-5 shadow-[0_4px_20px_rgba(26,54,93,0.04)] dark:border-white/10 dark:bg-card">
      <div className="mb-4 flex items-center gap-2 border-s-4 border-[#002045] ps-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#002045] dark:text-foreground">
          {c.metaSection}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className={gazetteLabelClass} htmlFor="blog-category">
            {c.fieldCategory} *
          </label>
          <select
            id="blog-category"
            required
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={gazetteInputClass}
          >
            <option value="" disabled>
              {c.chooseCategory}
            </option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={gazetteLabelClass}>{c.fieldStatus}</label>
          <div className="grid grid-cols-2 gap-2">
            <StatusButton
              active={status === 'published'}
              label={c.statusPublished}
              onClick={() => onStatusChange('published')}
            />
            <StatusButton
              active={status === 'draft'}
              label={c.statusDraft}
              onClick={() => onStatusChange('draft')}
            />
          </div>
        </div>

        <div>
          <label className={gazetteLabelClass} htmlFor="blog-tags">
            {c.fieldTags}
          </label>
          <input
            id="blog-tags"
            type="text"
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="جنائي، عقوبات، مصر"
            className={gazetteInputClass}
          />
        </div>
      </div>
    </section>
  );
}
