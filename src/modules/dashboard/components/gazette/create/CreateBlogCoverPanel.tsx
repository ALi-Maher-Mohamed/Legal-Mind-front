'use client';

import { useRef } from 'react';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/api/media';
import { gazetteCopy as c } from '../../../data/gazetteCopy';
import { gazetteInputClass, gazetteLabelClass } from '../lib/formStyles';

const COVER_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

type Props = {
  coverImage: string;
  showCover: boolean;
  isUploading?: boolean;
  onCoverChange: (value: string) => void;
  onCoverBroken: () => void;
  onUploadFile: (file: File) => void;
  onClearCover?: () => void;
};

export default function CreateBlogCoverPanel({
  coverImage,
  showCover,
  isUploading = false,
  onCoverChange,
  onCoverBroken,
  onUploadFile,
  onClearCover,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewSrc =
    resolveMediaUrl(coverImage.trim()) || coverImage.trim() || '';

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
            src={previewSrc}
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

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#002045] px-3 py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer dark:bg-brand dark:text-on-brand"
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {isUploading ? c.coverUploading : c.coverUpload}
        </button>

        {coverImage.trim() && onClearCover ? (
          <button
            type="button"
            disabled={isUploading}
            onClick={onClearCover}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-danger/25 px-3 py-2.5 text-xs font-bold text-danger transition hover:bg-danger/5 disabled:opacity-50 cursor-pointer"
            aria-label={c.coverClear}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {c.coverClear}
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={COVER_ACCEPT}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onUploadFile(file);
        }}
      />

      <label className={gazetteLabelClass} htmlFor="blog-cover">
        {c.fieldCover}
      </label>
      <input
        id="blog-cover"
        type="url"
        value={coverImage}
        onChange={(e) => onCoverChange(e.target.value)}
        placeholder="https://…"
        disabled={isUploading}
        className={gazetteInputClass}
      />
      <p className="mt-1.5 text-xs text-muted">{c.coverHint}</p>
    </section>
  );
}
