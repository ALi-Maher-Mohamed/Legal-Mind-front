import { resolveMediaUrl } from '@/lib/api/media';
import type { Blog, BlogAuthor } from '@/types/blog.types';
import { gazetteCopy as c } from '../data/gazetteCopy';

export function getBlogId(blog: Blog) {
  return blog._id || blog.id || '';
}

export function getBlogAuthor(blog: Blog): BlogAuthor | null {
  if (!blog.author || typeof blog.author === 'string') return null;
  return blog.author;
}

export function getAuthorName(blog: Blog) {
  const author = getBlogAuthor(blog);
  return author?.displayName || author?.fullName || c.unknownAuthor;
}

export function getAuthorAvatar(blog: Blog) {
  const author = getBlogAuthor(blog);
  return resolveMediaUrl(author?.avatar) || null;
}

export function getCoverImage(blog: Blog) {
  const cover = blog.coverImage?.trim();
  if (!cover) return null;
  return resolveMediaUrl(cover) || cover;
}

export function formatBlogDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function collectTags(blogs: Blog[], limit = 8) {
  const counts = new Map<string, number>();
  for (const blog of blogs) {
    for (const tag of blog.tags || []) {
      const key = tag.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}
