'use client';

import { ImageIcon } from 'lucide-react';
import { gazetteCopy as c } from '../../../data/gazetteCopy';
import { gazetteInputClass, gazetteLabelClass } from '../lib/formStyles';

type Props = {
  coverImage: string;
  showCover: boolean;
  onCoverChange: (value: string) => void;
  onCoverBroken: () => void;
};

export default function CreateBlogCoverPanel({
  coverImage,
  showCover,
  onCoverChange,
  onCoverBroken,
}: Props) {
  return (
    <section className="rounded-2xl border border-[#c4c6cf] bg-white p-5 shadow-[0_4px_20px_rgba(26,54,93,0.04)] dark:border-white/10 dark:bg-card">
      <div className="mb-4 flex items-center gap-2 border-s-4 border-[#002045] ps-3">
        <ImageIcon className="h-4 w-4 text-[#002045] dark:text-foreground" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#002045] dark:text-foreground">
          {c.coverPreview}
        </h2>
      </div>

      <div className="mb-3 overflow-hidden rounded-xl border border-dashed border-[#c4c6cf] bg-[#f1f4f6] dark:border-white/15 dark:bg-white/5">
        {showCover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage.trim()}
            alt=""
            className="h-40 w-full object-cover"
            onError={onCoverBroken}
          />
        ) : (
          <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted">
            <ImageIcon className="h-8 w-8 opacity-40" />
            <span className="text-xs">{c.noCover}</span>
          </div>
        )}
      </div>

      <label className={gazetteLabelClass} htmlFor="blog-cover">
        {c.fieldCover}
      </label>
      <input
        id="blog-cover"
        type="url"
        value={coverImage}
        onChange={(e) => onCoverChange(e.target.value)}
        placeholder="https://images.unsplash.com/..."
        className={gazetteInputClass}
      />
      <p className="mt-1.5 text-xs text-muted">{c.coverHint}</p>
    </section>
  );
}
