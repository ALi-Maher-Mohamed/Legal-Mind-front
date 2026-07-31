'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { sessionStore } from '@/lib/api/session';
import { blogsService } from '@/services/blogs.service';
import type { Blog, BlogCategory } from '@/types/blog.types';
import { gazetteCopy as c } from '../data/gazetteCopy';
import {
  getBlogAuthor,
  getBlogId,
  stripHtml,
} from '../lib/blogHelpers';

export function useBlogDetails() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categoryLabel = useMemo(() => {
    if (!blog) return '';
    return (
      categories.find((item) => item.value === blog.category)?.label || blog.category
    );
  }, [blog, categories]);

  const currentUser = sessionStore.getUser();
  const author = blog ? getBlogAuthor(blog) : null;
  const canManage =
    Boolean(currentUser?.id) &&
    Boolean(author?._id || author?.id) &&
    currentUser?.id === (author?._id || author?.id);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [detail, cats, trending] = await Promise.all([
        blogsService.getById(blogId),
        blogsService.getCategories().catch(() => [] as BlogCategory[]),
        blogsService.getTrending(6).catch(() => [] as Blog[]),
      ]);
      setBlog(detail);
      setCategories(cats);
      setRelated(trending.filter((item) => getBlogId(item) !== blogId).slice(0, 3));
      setBookmarked(Boolean(detail.isBookmarked));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'لم يتم العثور على المقال.');
    } finally {
      setIsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    if (blogId) void load();
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [blogId, load]);

  const bookmark = async () => {
    if (isBookmarking) return;
    setIsBookmarking(true);
    try {
      const result = await blogsService.toggleBookmark(blogId);
      setBookmarked(result.bookmarked);
      setBlog((prev) =>
        prev
          ? {
              ...prev,
              bookmarksCount: Math.max(
                0,
                (prev.bookmarksCount || 0) + (result.bookmarked ? 1 : -1),
              ),
            }
          : prev,
      );
      toastApiSuccess(result.bookmarked ? c.bookmarkOkAdd : c.bookmarkOkRemove);
    } catch (err) {
      toastApiError(err, c.bookmarkFail);
    } finally {
      setIsBookmarking(false);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: blog?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toastApiSuccess(c.shareOk);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toastApiSuccess(c.shareOk);
      } catch (err) {
        toastApiError(err, c.shareFail);
      }
    }
  };

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !blog) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(
      `${blog.title}. ${stripHtml(blog.content)}`,
    );
    utter.lang = 'ar-EG';
    utter.rate = 0.95;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const remove = async () => {
    if (!window.confirm(c.deleteConfirm)) return;
    setIsDeleting(true);
    try {
      const message = await blogsService.remove(blogId);
      toastApiSuccess(message || c.deleteOk);
      router.push('/dashboard?view=gazette');
    } catch (err) {
      toastApiError(err, 'تعذّر حذف المقال');
      setIsDeleting(false);
    }
  };

  return {
    blogId,
    blog,
    related,
    isLoading,
    error,
    isDeleting,
    isBookmarking,
    bookmarked,
    isSpeaking,
    categoryLabel,
    author,
    canManage,
    reload: load,
    goBack: () => router.push('/dashboard?view=gazette'),
    bookmark,
    share,
    toggleSpeech,
    remove,
  };
}
