import { resolveMediaUrl } from '@/lib/api/media';
import type { Blog, BlogAuthor, BlogComment, BlogCommentAuthor } from '@/types/blog.types';
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

export function getAuthorInitials(name?: string) {
  if (!name?.trim()) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

export function getCoverImage(blog: Blog) {
  const cover = blog.coverImage?.trim();
  if (!cover) return null;
  return resolveMediaUrl(cover) || cover;
}

export function looksLikeHtml(value?: string) {
  if (!value?.trim()) return false;
  return /^<[a-z][\s\S]*>/i.test(value.trim());
}

export function stripHtml(value?: string) {
  if (!value) return '';
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isEmptyRichContent(value?: string) {
  return !stripHtml(value);
}

export function getBlogExcerpt(blog: Blog, max = 160) {
  const raw = stripHtml(blog.excerpt || blog.content || '');
  if (raw.length <= max) return raw;
  return `${raw.slice(0, max).trim()}…`;
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

export function getCommentId(comment: BlogComment) {
  return comment._id || comment.id || '';
}

export function getCommentAuthor(comment: BlogComment): BlogCommentAuthor | null {
  if (!comment.author || typeof comment.author === 'string') return null;
  return comment.author;
}

export function getCommentAuthorId(comment: BlogComment) {
  const author = getCommentAuthor(comment);
  if (author) return author._id || author.id || '';
  return typeof comment.author === 'string' ? comment.author : '';
}

export function getCommentAuthorName(comment: BlogComment) {
  const author = getCommentAuthor(comment);
  return author?.displayName || author?.fullName || c.unknownAuthor;
}

export function getCommentAuthorAvatar(comment: BlogComment) {
  const author = getCommentAuthor(comment);
  return resolveMediaUrl(author?.avatar) || null;
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
