'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  FileText,
  ImageIcon,
  Newspaper,
  Save,
  Send,
} from 'lucide-react';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { blogsService } from '@/services/blogs.service';
import type { BlogCategory } from '@/types/blog.types';
import { gazetteCopy as c } from '@/modules/dashboard/data/gazetteCopy';
import { isEmptyRichContent } from '@/modules/dashboard/lib/blogHelpers';
import { dashPageBg } from '@/modules/dashboard/lib/panelStyles';
import BlogContentEditor from '@/modules/dashboard/components/gazette/BlogContentEditor';

const inputClass =
  'w-full rounded-xl border border-[#c4c6cf] bg-white px-4 py-2.5 text-sm text-[#002045] outline-none transition focus:border-[#002045] focus:ring-1 focus:ring-[#002045]/20 dark:border-white/15 dark:bg-white/5 dark:text-foreground dark:focus:border-white/40';

const labelClass = 'mb-1.5 block text-sm font-semibold text-[#002045] dark:text-foreground';

function CreateBlogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(editId));
  const [error, setError] = useState('');
  const [coverBroken, setCoverBroken] = useState(false);

  const pageTitle = useMemo(() => (editId ? c.editTitle : c.createTitle), [editId]);
  const pageSubtitle = useMemo(
    () => (editId ? c.editSubtitle : c.createSubtitle),
    [editId],
  );

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const cats = await blogsService.getCategories();
        setCategories(cats);
      } catch {
        setCategories([]);
      }

      if (!editId) {
        setIsLoading(false);
        return;
      }

      try {
        const blog = await blogsService.getById(editId);
        setTitle(blog.title || '');
        setContent(blog.content || '');
        setCoverImage(blog.coverImage || '');
        setCategory(blog.category || '');
        setTags((blog.tags || []).join(', '));
        setStatus(blog.status === 'draft' ? 'draft' : 'published');
      } catch (err) {
        setError(err instanceof Error ? err.message : c.createFail);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !category) {
      setError(c.createFail);
      return;
    }

    if (isEmptyRichContent(content)) {
      setError(c.contentRequired);
      toastApiError(new Error(c.contentRequired), c.contentRequired);
      return;
    }

    setIsSubmitting(true);

    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      category,
      coverImage: coverImage.trim() || undefined,
      tags: tagsArray,
      status,
    };

    try {
      if (editId) {
        const blog = await blogsService.update(editId, payload);
        toastApiSuccess(c.updateOk);
        router.push(`/dashboard/gazette/${blog._id || editId}`);
      } else {
        const blog = await blogsService.create(payload);
        toastApiSuccess(c.createOk);
        router.push(`/dashboard/gazette/${blog._id || blog.id}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : c.createFail;
      setError(message);
      toastApiError(err, c.createFail);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${dashPageBg} px-4 py-10`} dir="rtl">
        <div className="mx-auto h-[28rem] max-w-6xl animate-pulse rounded-2xl bg-white dark:bg-card" />
      </div>
    );
  }

  const showCover = Boolean(coverImage.trim()) && !coverBroken;

  return (
    <div className={`min-h-screen ${dashPageBg} px-4 py-6 sm:px-6 sm:py-8`} dir="rtl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <button
          type="button"
          onClick={() =>
            router.push(editId ? `/dashboard/gazette/${editId}` : '/dashboard?view=gazette')
          }
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted transition hover:text-[#002045] cursor-pointer dark:hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" />
          {c.cancel}
        </button>

        <header className="relative overflow-hidden rounded-2xl bg-[#002045] px-5 py-7 text-white sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(254,212,136,0.18),transparent_45%)]" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-[#fed488]/20 px-2 py-1 text-[11px] font-bold text-[#fed488]">
                <Newspaper className="h-3.5 w-3.5" />
                {c.eyebrow}
              </span>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{pageTitle}</h1>
              <p className="mt-2 max-w-xl text-sm text-white/80">{pageSubtitle}</p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <form onSubmit={(e) => void handleSubmit(e)} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            <section className="rounded-2xl border border-[#c4c6cf] bg-white p-5 shadow-[0_4px_20px_rgba(26,54,93,0.04)] dark:border-white/10 dark:bg-card sm:p-6">
              <div className="mb-4 flex items-center gap-2 border-s-4 border-[#002045] ps-3">
                <FileText className="h-4 w-4 text-[#002045] dark:text-foreground" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-[#002045] dark:text-foreground">
                  {c.contentSection}
                </h2>
              </div>

              <div className="mb-5">
                <label className={labelClass} htmlFor="blog-title">
                  {c.fieldTitle} *
                </label>
                <input
                  id="blog-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: فهم القانون الجنائي المصري"
                  className={`${inputClass} text-base font-semibold`}
                />
              </div>

              <div>
                <label className={labelClass}>{c.fieldContent} *</label>
                <BlogContentEditor content={content} onChange={setContent} />
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:col-span-4">
            <section className="rounded-2xl border border-[#c4c6cf] bg-white p-5 shadow-[0_4px_20px_rgba(26,54,93,0.04)] dark:border-white/10 dark:bg-card">
              <div className="mb-4 flex items-center gap-2 border-s-4 border-[#002045] ps-3">
                <h2 className="text-sm font-bold uppercase tracking-wide text-[#002045] dark:text-foreground">
                  {c.metaSection}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass} htmlFor="blog-category">
                    {c.fieldCategory} *
                  </label>
                  <select
                    id="blog-category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
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
                  <label className={labelClass} htmlFor="blog-status">
                    {c.fieldStatus}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus('published')}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition cursor-pointer ${
                        status === 'published'
                          ? 'border-[#002045] bg-[#002045] text-white'
                          : 'border-[#c4c6cf] bg-white text-[#43474e] hover:border-[#002045] dark:border-white/15 dark:bg-white/5 dark:text-muted'
                      }`}
                    >
                      {c.statusPublished}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('draft')}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition cursor-pointer ${
                        status === 'draft'
                          ? 'border-[#002045] bg-[#002045] text-white'
                          : 'border-[#c4c6cf] bg-white text-[#43474e] hover:border-[#002045] dark:border-white/15 dark:bg-white/5 dark:text-muted'
                      }`}
                    >
                      {c.statusDraft}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="blog-tags">
                    {c.fieldTags}
                  </label>
                  <input
                    id="blog-tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="جنائي، عقوبات، مصر"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

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
                    onError={() => setCoverBroken(true)}
                  />
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                    <span className="text-xs">{c.noCover}</span>
                  </div>
                )}
              </div>

              <label className={labelClass} htmlFor="blog-cover">
                {c.fieldCover}
              </label>
              <input
                id="blog-cover"
                type="url"
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.value);
                  setCoverBroken(false);
                }}
                placeholder="https://images.unsplash.com/..."
                className={inputClass}
              />
              <p className="mt-1.5 text-xs text-muted">{c.coverHint}</p>
            </section>

            <div className="sticky bottom-4 space-y-2 lg:bottom-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] py-3.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {status === 'published' ? (
                  <Send className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting
                  ? c.saving
                  : editId
                    ? c.saveChanges
                    : status === 'published'
                      ? c.publishNow
                      : c.saveDraft}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default function CreateBlogPage() {
  return (
    <Suspense
      fallback={
        <div className={`min-h-screen ${dashPageBg} px-4 py-10`} dir="rtl">
          <div className="mx-auto h-[28rem] max-w-6xl animate-pulse rounded-2xl bg-white dark:bg-card" />
        </div>
      }
    >
      <CreateBlogForm />
    </Suspense>
  );
}
