'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { blogsService } from '@/services/blogs.service';
import type { BlogCategory } from '@/types/blog.types';
import { gazetteCopy as c } from '../data/gazetteCopy';
import { isEmptyRichContent } from '../lib/blogHelpers';

export function useCreateBlogForm() {
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
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const pageTitle = useMemo(() => (editId ? c.editTitle : c.createTitle), [editId]);
  const pageSubtitle = useMemo(
    () => (editId ? c.editSubtitle : c.createSubtitle),
    [editId],
  );

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setCategories(await blogsService.getCategories());
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

  const goBack = () => {
    router.push(editId ? `/dashboard/gazette/${editId}` : '/dashboard?view=gazette');
  };

  const uploadCover = async (file: File) => {
    const allowed = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ]);
    if (!allowed.has(file.type)) {
      toastApiError(new Error(c.coverTypeError), c.coverTypeError);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toastApiError(new Error(c.coverSizeError), c.coverSizeError);
      return;
    }

    setIsUploadingCover(true);
    try {
      const result = await blogsService.uploadImage(file);
      setCoverImage(result.url);
      setCoverBroken(false);
      toastApiSuccess(result.message || c.coverUploadOk);
    } catch (err) {
      toastApiError(err, c.coverUploadFail);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const clearCover = () => {
    setCoverImage('');
    setCoverBroken(false);
  };

  const submit = async (e: React.FormEvent) => {
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

    // PUT /api/v1/blogs/:blogId — تحديث مقال الكاتب
    const payload = {
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
      status,
      ...(coverImage.trim() ? { coverImage: coverImage.trim() } : {}),
      ...(tagsArray.length ? { tags: tagsArray } : {}),
    };

    try {
      if (editId) {
        const result = await blogsService.update(editId, payload);
        toastApiSuccess(result.message);
        const blog = result.blog;
        router.push(`/dashboard/gazette/${blog._id || blog.id || editId}`);
        return;
      }

      const result = await blogsService.create(payload);
      toastApiSuccess(result.message);
      const blog = result.blog;
      router.push(`/dashboard/gazette/${blog._id || blog.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '');
      toastApiError(err);
      setIsSubmitting(false);
    }
  };

  return {
    editId,
    title,
    setTitle,
    content,
    setContent,
    coverImage,
    setCoverImage,
    category,
    setCategory,
    tags,
    setTags,
    status,
    setStatus,
    categories,
    isSubmitting,
    isLoading,
    error,
    coverBroken,
    setCoverBroken,
    isUploadingCover,
    pageTitle,
    pageSubtitle,
    showCover: Boolean(coverImage.trim()) && !coverBroken,
    goBack,
    uploadCover,
    clearCover,
    submit,
  };
}
