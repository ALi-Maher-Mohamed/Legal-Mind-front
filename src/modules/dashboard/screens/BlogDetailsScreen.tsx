'use client';

import Link from 'next/link';
import { ArrowRight, FolderOpen } from 'lucide-react';
import { gazetteCopy as c } from '../data/gazetteCopy';
import {
  getAuthorAvatar,
  getAuthorName,
  getCoverImage,
} from '../lib/blogHelpers';
import { dashPageBg } from '../lib/panelStyles';
import { useBlogDetails } from '../hooks/useBlogDetails';
import BlogComments from '../components/gazette/BlogComments';
import BlogDetailsMeta from '../components/gazette/details/BlogDetailsMeta';
import BlogDetailsBody from '../components/gazette/details/BlogDetailsBody';
import BlogDetailsActions from '../components/gazette/details/BlogDetailsActions';
import BlogRelatedAside from '../components/gazette/details/BlogRelatedAside';

export default function BlogDetailsScreen() {
  const d = useBlogDetails();

  if (d.isLoading) {
    return (
      <div className={`min-h-screen ${dashPageBg} px-4 py-10`} dir="rtl">
        <div className="mx-auto h-96 max-w-5xl animate-pulse rounded-xl bg-white dark:bg-card" />
      </div>
    );
  }

  if (d.error || !d.blog) {
    return (
      <div className={`min-h-screen ${dashPageBg} px-4 py-10`} dir="rtl">
        <div className="mx-auto max-w-3xl rounded-xl border border-[#c4c6cf] bg-white py-16 text-center dark:border-white/10 dark:bg-card">
          <p className="mb-4 font-bold text-danger">
            {d.error || 'لم يتم العثور على المقال.'}
          </p>
          <Link
            href="/dashboard?view=gazette"
            className="text-sm font-bold text-brand underline"
          >
            {c.backToIndex}
          </Link>
        </div>
      </div>
    );
  }

  const { blog } = d;
  const authorName = getAuthorName(blog);

  return (
    <div
      className={`min-h-screen ${dashPageBg} px-4 py-6 text-start sm:px-6 sm:py-8 lg:px-8`}
      dir="rtl"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12">
        <article className="rounded-xl border border-[#c4c6cf] bg-white p-5 shadow-[0_4px_20px_rgba(26,54,93,0.05)] dark:border-white/10 dark:bg-card sm:p-8 lg:col-span-8">
          <button
            type="button"
            onClick={d.goBack}
            className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-brand cursor-pointer"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            {c.backToIndex}
          </button>

          <span className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-[#002045]/15 bg-[#002045] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm dark:border-white/20 dark:bg-[#1a365d]">
            <FolderOpen className="h-3.5 w-3.5 text-[#fed488]" />
            {d.categoryLabel}
          </span>

          <h1 className="mb-5 text-2xl font-bold leading-snug text-[#002045] dark:text-foreground sm:text-3xl md:text-4xl">
            {blog.title}
          </h1>

          <BlogDetailsMeta
            authorName={authorName}
            avatar={getAuthorAvatar(blog)}
            author={d.author}
            date={blog.publishedAt || blog.createdAt}
            readingTime={blog.readingTime}
            views={blog.views}
          />

          <BlogDetailsBody
            title={blog.title}
            content={blog.content}
            cover={getCoverImage(blog)}
            tags={blog.tags}
          />

          <BlogDetailsActions
            blogId={d.blogId}
            bookmarked={d.bookmarked}
            isBookmarking={d.isBookmarking}
            isSpeaking={d.isSpeaking}
            isDeleting={d.isDeleting}
            canManage={d.canManage}
            onBookmark={() => void d.bookmark()}
            onShare={() => void d.share()}
            onSpeech={d.toggleSpeech}
            onDelete={() => void d.remove()}
          />

          <BlogComments blogId={d.blogId} />
        </article>

        <BlogRelatedAside related={d.related} tags={blog.tags} />
      </div>
    </div>
  );
}
