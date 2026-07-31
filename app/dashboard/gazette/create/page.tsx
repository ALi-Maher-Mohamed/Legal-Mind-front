'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Save } from 'lucide-react';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { blogsService } from '@/services/blogs.service';
import type { BlogCategory } from '@/types/blog.types';
import { gazetteCopy as c } from '@/modules/dashboard/data/gazetteCopy';
import { dashPageBg, dashPanel } from '@/modules/dashboard/lib/panelStyles';

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

  const pageTitle = useMemo(() => (editId ? c.editTitle : c.createTitle), [editId]);

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
    setIsSubmitting(true);
    setError('');

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
        <div className="mx-auto h-80 max-w-4xl animate-pulse rounded-2xl bg-white dark:bg-card" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${dashPageBg} px-4 py-6 sm:px-6 sm:py-8`} dir="rtl">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        <button
          type="button"
          onClick={() =>
            router.push(editId ? `/dashboard/gazette/${editId}` : '/dashboard?view=gazette')
          }
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted hover:text-brand cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" />
          {c.cancel}
        </button>

        <div className={`${dashPanel} p-5 sm:p-8`}>
          <h1 className="mb-6 border-b border-brand/10 pb-4 text-2xl font-bold text-foreground dark:border-white/10">
            {pageTitle}
          </h1>

          {error ? (
            <div className="mb-6 rounded-xl bg-danger/5 p-4 text-sm text-danger">{error}</div>
          ) : null}

          <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">{c.fieldTitle} *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border border-brand/15 bg-[#f8faff] px-4 py-2.5 text-sm text-foreground outline-none focus:border-brand dark:border-white/10 dark:bg-white/5"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">{c.fieldCategory} *</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-brand/15 bg-[#f8faff] px-4 py-2.5 text-sm text-foreground outline-none focus:border-brand dark:border-white/10 dark:bg-white/5"
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

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">{c.fieldStatus}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                  className="rounded-xl border border-brand/15 bg-[#f8faff] px-4 py-2.5 text-sm text-foreground outline-none focus:border-brand dark:border-white/10 dark:bg-white/5"
                >
                  <option value="published">{c.publish}</option>
                  <option value="draft">{c.saveDraft}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">{c.fieldCover}</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="rounded-xl border border-brand/15 bg-[#f8faff] px-4 py-2.5 text-sm text-foreground outline-none focus:border-brand dark:border-white/10 dark:bg-white/5"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">{c.fieldTags}</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="rounded-xl border border-brand/15 bg-[#f8faff] px-4 py-2.5 text-sm text-foreground outline-none focus:border-brand dark:border-white/10 dark:bg-white/5"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">{c.fieldContent} *</label>
              <textarea
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="resize-y rounded-xl border border-brand/15 bg-[#f8faff] px-4 py-3 text-sm leading-relaxed text-foreground outline-none focus:border-brand dark:border-white/10 dark:bg-white/5"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-on-brand transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? c.saving : editId ? c.saveChanges : c.publish}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateBlogPage() {
  return (
    <Suspense
      fallback={
        <div className={`min-h-screen ${dashPageBg} px-4 py-10`} dir="rtl">
          <div className="mx-auto h-80 max-w-4xl animate-pulse rounded-2xl bg-white dark:bg-card" />
        </div>
      }
    >
      <CreateBlogForm />
    </Suspense>
  );
}
