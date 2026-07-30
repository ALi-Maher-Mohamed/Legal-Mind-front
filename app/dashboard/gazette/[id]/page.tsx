"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Edit,
  Trash2,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import DashPanel from "@/modules/dashboard/components/ui/DashPanel";

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
          `http://localhost:5001/api/blogs/${blogId}`,
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
      "هل أنت متأكد من حذف هذا المقال نهائياً؟",
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);

      // 1. هنجيب التوكن من المكان اللي مسجلاه فيه (غالباً localStorage)
      // اتأكدي بس إن اسم المفتاح 'token' متطابق مع اللي بتستخدميه وقت تسجيل الدخول
      const token = localStorage.getItem("token");

      // 2. هنبعت التوكن في الـ Headers
      const response = await fetch(
        `http://localhost:5001/api/blogs/${blogId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ده السطر اللي هيدي الصلاحية للحذف
          },
        },
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
      <div className="w-full max-w-4xl mx-auto p-6" dir="rtl">
        <DashPanel className="h-96 animate-pulse bg-slate-200/50">
          <div className="w-full h-full"></div>
        </DashPanel>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center" dir="rtl">
        <DashPanel className="py-20 ">
          <p className="text-red-500 font-medium text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push("/dashboard/gazette")}
            className="text-blue-600 underline  "
          >
            العودة للجريدة
          </button>
        </DashPanel>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-10"
      dir="rtl"
    >
      <button
        onClick={() => router.push("/dashboard")}
        className="pt-5 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors w-fit font-medium"
      >
        <ArrowRight className="w-5 h-5" />
        <span>العودة للجريدة</span>
      </button>

      <DashPanel padded={false} className="overflow-hidden">
        <div className="h-64 md:h-80 w-full bg-slate-100 relative">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-slate-300" />
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/95 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full shadow">
            {blog.category}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* العنوان */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 leading-relaxed">
            {blog.title}
          </h1>

          {/* شريط الأدوات (لايك، تعديل، حذف) */}
          <div className="flex flex-wrap items-center justify-between border-y border-slate-100 py-4 mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isLiked
                    ? "bg-red-50 text-red-600"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-red-600" : ""}`} />
                <span>{likesCount > 0 ? likesCount : "إعجاب"}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* زرار التعديل (هياخدك لصفحة تانية لسه هتعمليها) */}
              <Link
                href={`/dashboard/gazette/edit/${blog._id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>تعديل</span>
              </Link>

              {/* زرار الحذف */}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? "جاري الحذف..." : "حذف"}</span>
              </button>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-loose whitespace-pre-wrap">
            {blog.content}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </DashPanel>
    </div>
  );
}
