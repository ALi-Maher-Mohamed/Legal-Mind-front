"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  Clock3,
  FolderOpen,
  CalendarDays,
  Share2,
  Trash2,
  Volume2,
  VolumeX,
  Pencil,
} from "lucide-react";
import { toastApiError, toastApiSuccess } from "@/lib/api/toast";
import { sessionStore } from "@/lib/api/session";
import { blogsService } from "@/services/blogs.service";
import type { Blog, BlogCategory } from "@/types/blog.types";
import { gazetteCopy as c } from "@/modules/dashboard/data/gazetteCopy";
import {
  formatBlogDate,
  getAuthorAvatar,
  getAuthorName,
  getBlogAuthor,
  getBlogId,
  getCoverImage,
  looksLikeHtml,
  stripHtml,
} from "@/modules/dashboard/lib/blogHelpers";
import { dashPageBg } from "@/modules/dashboard/lib/panelStyles";
import {
  BlogAuthorAvatar,
  BlogCover,
} from "@/modules/dashboard/components/gazette/BlogMedia";
import BlogComments from "@/modules/dashboard/components/gazette/BlogComments";

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [related, setRelated] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categoryLabel = useMemo(() => {
    if (!blog) return "";
    return (
      categories.find((item) => item.value === blog.category)?.label ||
      blog.category
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
    setError("");
    try {
      const [detail, cats, trending] = await Promise.all([
        blogsService.getById(blogId),
        blogsService.getCategories().catch(() => [] as BlogCategory[]),
        blogsService.getTrending(6).catch(() => [] as Blog[]),
      ]);
      setBlog(detail);
      setCategories(cats);
      setRelated(
        trending.filter((item) => getBlogId(item) !== blogId).slice(0, 3),
      );
      setBookmarked(Boolean(detail.isBookmarked));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "لم يتم العثور على المقال.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (blogId) void load();
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [blogId, load]);

  const handleBookmark = async () => {
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

  const handleShare = async () => {
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

  const handleSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis || !blog)
      return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(
      `${blog.title}. ${stripHtml(blog.content)}`,
    );
    utter.lang = "ar-EG";
    utter.rate = 0.95;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const handleDelete = async () => {
    if (!window.confirm(c.deleteConfirm)) return;
    setIsDeleting(true);
    try {
      const message = await blogsService.remove(blogId);
      toastApiSuccess(message || c.deleteOk);
      router.push("/dashboard?view=gazette");
    } catch (err) {
      toastApiError(err, "تعذّر حذف المقال");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${dashPageBg} px-4 py-10`} dir="rtl">
        <div className="mx-auto h-96 max-w-5xl animate-pulse rounded-xl bg-white dark:bg-card" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={`min-h-screen ${dashPageBg} px-4 py-10`} dir="rtl">
        <div className="mx-auto max-w-3xl rounded-xl border border-[#c4c6cf] bg-white py-16 text-center dark:border-white/10 dark:bg-card">
          <p className="mb-4 font-bold text-danger">
            {error || "لم يتم العثور على المقال."}
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

  const cover = getCoverImage(blog);
  const avatar = getAuthorAvatar(blog);
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
            onClick={() => router.push("/dashboard?view=gazette")}
            className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted hover:text-brand cursor-pointer"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            {c.backToIndex}
          </button>

          <span className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-[#002045]/15 bg-[#002045] px-2.5 py-1 text-[11px] font-bold text-white shadow-sm dark:border-white/20 dark:bg-[#1a365d]">
            <FolderOpen className="h-3.5 w-3.5 text-[#fed488]" />
            {categoryLabel}
          </span>

          <h1 className="mb-5 text-2xl font-bold leading-snug text-[#002045] dark:text-foreground sm:text-3xl md:text-4xl">
            {blog.title}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-[#e5e8ee] pb-5 text-sm text-[#43474e] dark:border-white/10 dark:text-muted">
            <div className="flex items-center gap-2">
              <BlogAuthorAvatar
                src={avatar}
                name={authorName}
                className="h-10 w-10"
                textClassName="text-xs"
                iconClassName="h-4 w-4"
              />
              <div>
                <p className="font-semibold text-[#181c1e] dark:text-foreground">
                  {authorName}
                </p>
                {author?.officeName ? (
                  <p className="text-xs text-muted">{author.officeName}</p>
                ) : null}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatBlogDate(blog.publishedAt || blog.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {c.readingTime(blog.readingTime || 1)}
            </span>
            <span>{c.views(blog.views || 0)}</span>
          </div>

          {cover ? (
            <BlogCover
              src={cover}
              alt={blog.title}
              className="mb-8 h-52 w-full rounded-lg sm:h-64 md:h-72"
              iconClassName="h-14 w-14"
            />
          ) : null}

          {looksLikeHtml(blog.content) ? (
            <div
              className="contract-editor-prose blog-article-prose text-[#1f2937] dark:text-foreground/90"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          ) : (
            <div className="whitespace-pre-wrap text-base leading-[2] text-[#1f2937] dark:text-foreground/90">
              {blog.content}
            </div>
          )}

          {blog.tags?.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#c4c6cf] px-3 py-1 text-xs text-[#43474e] dark:border-white/15 dark:text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e8ee] pt-6 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleBookmark()}
                disabled={isBookmarking}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  bookmarked
                    ? "border-[#002045] bg-[#002045] text-white"
                    : "border-[#c4c6cf] bg-white text-[#002045] hover:border-[#002045] dark:border-white/15 dark:bg-white/5 dark:text-foreground"
                }`}
              >
                <Bookmark
                  className={`h-3.5 w-3.5 ${bookmarked ? "fill-current" : ""}`}
                />
                {bookmarked ? c.saved : c.save}
              </button>
              <button
                type="button"
                onClick={() => void handleShare()}
                className="inline-flex items-center gap-2 rounded-full border border-[#c4c6cf] px-4 py-2 text-xs font-bold text-[#002045] hover:border-[#002045] dark:border-white/15 dark:text-foreground cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                {c.share}
              </button>
              <button
                type="button"
                onClick={handleSpeech}
                className="inline-flex items-center gap-2 rounded-full border border-[#c4c6cf] px-4 py-2 text-xs font-bold text-[#002045] hover:border-[#002045] dark:border-white/15 dark:text-foreground cursor-pointer"
              >
                {isSpeaking ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
                {isSpeaking ? c.stopListen : c.listen}
              </button>
            </div>

            {canManage ? (
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/gazette/create?edit=${blogId}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c4c6cf] px-4 py-2 text-xs font-bold text-[#002045] dark:border-white/15 dark:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {c.edit}
                </Link>
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 rounded-lg border border-danger/30 px-4 py-2 text-xs font-bold text-danger hover:bg-danger/5 disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isDeleting ? c.deleting : c.delete}
                </button>
              </div>
            ) : null}
          </div>

          <BlogComments blogId={blogId} />
        </article>

        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-xl bg-[#f1f4f6] p-5 dark:bg-white/5">
            <h3 className="mb-4 border-s-4 border-[#002045] ps-3 text-sm font-bold uppercase text-[#002045] dark:text-foreground">
              {c.related}
            </h3>
            <div className="space-y-3">
              {related.length === 0 ? (
                <p className="text-sm text-muted">—</p>
              ) : (
                related.map((item) => {
                  const itemCover = getCoverImage(item);
                  const itemAuthor = getAuthorName(item);
                  return (
                    <Link
                      key={getBlogId(item)}
                      href={`/dashboard/gazette/${getBlogId(item)}`}
                      className="flex items-center gap-3 rounded-lg bg-white p-2 transition hover:shadow-sm dark:bg-white/5"
                    >
                      <BlogCover
                        src={itemCover}
                        className="h-14 w-14 shrink-0 rounded-md"
                        iconClassName="h-5 w-5"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-[#002045] dark:text-foreground">
                          {item.title}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <BlogAuthorAvatar
                            src={getAuthorAvatar(item)}
                            name={itemAuthor}
                            className="h-5 w-5"
                            textClassName="text-[8px]"
                            iconClassName="h-2.5 w-2.5"
                          />
                          <span className="truncate text-xs text-muted">
                            {itemAuthor}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {blog.tags?.length ? (
            <div className="rounded-xl bg-[#f1f4f6] p-5 dark:bg-white/5">
              <h3 className="mb-4 border-s-4 border-[#002045] ps-3 text-sm font-bold uppercase text-[#002045] dark:text-foreground">
                {c.tags}
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#c4c6cf] bg-white px-3 py-1 text-sm text-[#43474e] dark:border-white/15 dark:bg-white/5 dark:text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <Link
            href="/dashboard?view=consultation"
            className="flex w-full items-center justify-center rounded-xl bg-[#002045] px-4 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            {c.consultCta}
          </Link>
        </aside>
      </div>
    </div>
  );
}
