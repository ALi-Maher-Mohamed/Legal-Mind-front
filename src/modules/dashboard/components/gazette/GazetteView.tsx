
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Image as ImageIcon, ArrowLeft } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    blogs: Blog[];
  };
}

export default function GazetteView() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://localhost:5001/api/blogs?limit=100&sort=newest",
        );
        const result: ApiResponse = await response.json();

        if (result.success) {
          setBlogs(result.data.blogs);
        } else {
          setError(result.message || "حدث خطأ أثناء جلب المقالات");
        }
      } catch (err) {
        setError("تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.");
        console.error("Fetch Blogs Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div
      className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-5 mb-4 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white uppercase tracking-wide">
            فهرس الجريدة
          </h1>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mt-2">
            تصفح أحدث الإصدارات والتحليلات القانونية
          </p>
        </div>
        <Link
          href="/dashboard/gazette/create"
          className="text-[11px] font-bold uppercase tracking-wider text-on-brand  inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-blue-600 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] hover:bg-slate-800 transition-colors rounded-2xl border "
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مقال جديد</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 animate-pulse bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div>
          ))}
        </div>
      ) : error ? (
        <div className="border border-slate-200 bg-white dark:bg-slate-900 text-center py-20">
          <p className="text-red-800 font-serif font-bold text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-slate-600 uppercase tracking-widest text-xs font-bold underline"
          >
            حاول مرة أخرى
          </button>
        </div>
      ) : blogs.length === 0 ? (
        <div className="border border-slate-200 bg-white dark:bg-slate-900 flex flex-col items-center justify-center py-24 text-slate-500">
          <ImageIcon className="w-12 h-12 mb-6 text-slate-300" />
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide">
            لا توجد وثائق حتى الآن
          </h2>
          <p className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400">كن أول من يضيف محتوى للجريدة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col group hover:shadow-lg transition-all duration-300"
            >
              {blog.coverImage ? (
                <div className="h-52 w-full border-b border-slate-200 dark:border-slate-800 overflow-hidden relative">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : null}

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="text-[10px] font-bold tracking-[0.2em] text-blue-600 uppercase mb-4">
                  {blog.category}
                </div>

                <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-4 leading-snug uppercase line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-sm font-serif text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed flex-grow">
                  {blog.excerpt}
                </p>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-5 mt-auto">
                  <Link
                    href={`/dashboard/gazette/${blog._id}`}
                    className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-slate-900 dark:text-white uppercase hover:text-blue-500 transition-colors w-fit"
                  >
                    <span>اقرأ الوثيقة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}