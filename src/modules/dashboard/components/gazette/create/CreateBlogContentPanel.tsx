'use client';

import { FileText } from 'lucide-react';
import { gazetteCopy as c } from '../../../data/gazetteCopy';
import BlogContentEditor from '../BlogContentEditor';
import { gazetteInputClass, gazetteLabelClass } from '../lib/formStyles';

type Props = {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
};

export default function CreateBlogContentPanel({
  title,
  content,
  onTitleChange,
  onContentChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-[#c4c6cf] bg-white p-5 shadow-[0_4px_20px_rgba(26,54,93,0.04)] dark:border-white/10 dark:bg-card sm:p-6">
      <div className="mb-4 flex items-center gap-2 border-s-4 border-[#002045] ps-3">
        <FileText className="h-4 w-4 text-[#002045] dark:text-foreground" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#002045] dark:text-foreground">
          {c.contentSection}
        </h2>
      </div>

      <div className="mb-5">
        <label className={gazetteLabelClass} htmlFor="blog-title">
          {c.fieldTitle} *
        </label>
        <input
          id="blog-title"
          type="text"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="مثال: فهم القانون الجنائي المصري"
          className={`${gazetteInputClass} text-base font-semibold`}
        />
      </div>

      <div>
        <label className={gazetteLabelClass}>{c.fieldContent} *</label>
        <BlogContentEditor content={content} onChange={onContentChange} />
      </div>
    </section>
  );
}
