"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";
import {
  Heart,
  Edit,
  Trash2,
  ArrowRight,
  Clock,
  Volume2,
  User,
} from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  likes?: number;
}

export default function BlogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5001/api/blogs/${blogId}`
        );
        const result = await response.json();

        if (result.success) {
          setBlog(result.data.blog);
          setLikesCount(result.data.blog.likes || 0);
        } else {
          setError("لم يتم العثور على المقال.");
        }
      } catch (err) {
        setError("تعذر الاتصال بالخادم.");
        console.error("Fetch Blog Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (blogId) fetchBlogDetails();
  }, [blogId]);

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      await fetch(`http://localhost:5001/api/blogs/${blogId}/like`, {
        method: "POST",
      });
    } catch (err) {
      setIsLiked(!newLikedState);
      setLikesCount((prev) => (newLikedState ? prev - 1 : prev + 1));
      console.error("Like Error:", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "هل أنت متأكد من حذف هذا المقال نهائياً؟"
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5001/api/blogs/${blogId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        router.push("/dashboard");
      } else {
        alert(result.message || "حدث خطأ أثناء الحذف.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("فشل الاتصال بالخادم أثناء الحذف.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  py-12" dir="rtl">
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
          <div className="bg-white border border-[#e5e0d8] shadow-sm h-96 animate-pulse w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-[#f4f1ea] py-12" dir="rtl">
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-center">
          <div className="bg-white border border-[#e5e0d8] shadow-sm py-20">
            <p className="text-red-800 font-serif font-bold text-lg mb-4">{error}</p>
            <button
              onClick={() => router.push("/dashboard/gazette")}
              className="text-slate-600 uppercase tracking-widest text-xs font-bold underline"
            >
              العودة للجريدة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-slate-900 py-8 md:py-12 px-4 sm:px-6" dir="rtl">
      
      <div className="w-full max-w-3xl mx-auto bg-white border border-blue-200 shadow-sm p-6 sm:p-10 md:p-14">
        
       
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-[0.15em] text-slate-500 hover:text-blue-500 uppercase mb-8 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة لـ فهرس الجريدة</span>
        </button>

        <div className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-3">
          {blog.category}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6 leading-snug uppercase">
          {blog.title}
        </h1>

      

        {blog.coverImage && (
          <div className="w-full mb-10">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto object-cover grayscale-[15%]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="prose prose-sm sm:prose-base md:prose-lg prose-slate max-w-none font-serif text-slate-800 leading-loose whitespace-pre-wrap mb-12">
          {blog.content}
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 mb-12 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 border border-slate-200 text-slate-500 text-[10px] sm:text-xs font-bold tracking-wider uppercase"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-slate-200 pt-8 mt-8">
      
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold tracking-wider uppercase border transition-all ${
                isLiked
                  ? "bg-slate-100 border-slate-300 text-slate-900"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-slate-900" : ""}`} />
              <span>{likesCount > 0 ? `${likesCount} إعجاب` : "إعجاب"}</span>
            </button>

            <div className="flex items-center gap-13 md:gap-3">
              <Link
                href={`/dashboard/gazette/edit/${blog._id}`}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold tracking-wider uppercase hover:bg-slate-50 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>تعديل</span>
              </Link>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-700 text-xs font-bold tracking-wider uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? "جاري..." : "حذف"}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}