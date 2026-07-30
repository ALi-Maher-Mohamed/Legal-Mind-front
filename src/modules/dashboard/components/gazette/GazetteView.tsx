"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Image as ImageIcon, ArrowLeft } from "lucide-react";
import DashPanel from "../ui/DashPanel";

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
      className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10"
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            الجريدة القانونية
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            تصفح أحدث المقالات والتحليلات القانونية.
          </p>
        </div>
        <Link
          href="/dashboard/gazette/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مقال جديد</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {[1, 2, 3].map((n) => (
            <DashPanel key={n} className="h-80 animate-pulse bg-slate-200/50">
              <div className="w-full h-full"></div>
            </DashPanel>
          ))}
        </div>
      ) : error ? (
        <DashPanel className="text-center py-16">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 underline text-sm"
          >
            حاول مرة أخرى
          </button>
        </DashPanel>
      ) : blogs.length === 0 ? (
        <DashPanel className="flex flex-col items-center justify-center py-20 text-slate-500">
          <ImageIcon className="w-16 h-16 mb-4 text-slate-300" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">
            لا توجد مقالات حتى الآن
          </h2>
          <p className="text-sm">كن أول من يضيف محتوى للجريدة!</p>
        </DashPanel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {blogs.map((blog) => (
            <DashPanel
              key={blog._id}
              padded={false}
              className="overflow-hidden flex flex-col transition-transform hover:scale-[1.02] duration-300"
            >
              <div className="h-48 w-full bg-slate-100 relative">
                {blog.coverImage ? (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {blog.category}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-grow">
                  {blog.excerpt}
                </p>
                <Link
                  href={`/dashboard/gazette/${blog._id}`}
                  className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors mt-auto w-fit"
                >
                  <span>اقرأ المزيد</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </DashPanel>
          ))}
        </div>
      )}
    </div>
  );
}
