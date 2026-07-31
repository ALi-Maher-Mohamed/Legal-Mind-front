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

    const payload = {
      title: title.trim(),
      content: content.trim(),
      category,
      coverImage: coverImage.trim() || undefined,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      status,
    };

    try {
      if (editId) {
        const blog = await blogsService.update(editId, payload);
        toastApiSuccess(c.updateOk);
        router.push(`/dashboard/gazette/${blog._id || editId}`);
        return;
      }

      const blog = await blogsService.create(payload);
      toastApiSuccess(c.createOk);
      router.push(`/dashboard/gazette/${blog._id || blog.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : c.createFail);
      toastApiError(err, c.createFail);
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
    pageTitle,
    pageSubtitle,
    showCover: Boolean(coverImage.trim()) && !coverBroken,
    goBack,
    submit,
  };
}
