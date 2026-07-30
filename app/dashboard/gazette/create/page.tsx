
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";
import DashPanel from "@/modules/dashboard/components/ui/DashPanel";

export default function CreateBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const [categories, setCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/blogs/categories",
        );

        const result = await response.json();
        if (result.success && result.data && Array.isArray(result.data.categories)) {
          const cats = result.data.categories.map((c: any) => c.value); 
          setCategories(cats);
        } else if (Array.isArray(result)) {
          setCategories(result);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Fetch Categories Error:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const token = localStorage.getItem("token")?.replace(/"/g, "");
    console.log("Token:", token);

    if (!token) {
      setError("لم يتم العثور على Token");
      setIsSubmitting(false);
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const newBlogData = {
      title,
      content,
      coverImage,
      category,
      tags: tagsArray,
    };

    try {
      const response = await fetch("http://localhost:5001/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBlogData),
      });

      console.log("Status:", response.status);

      const result = await response.json();

      console.log("Response:", result);

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError(result.message || "حدث خطأ أثناء إضافة المقال.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Create Blog Error:", err);
      setError("فشل الاتصال بالخادم.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-10"
      dir="rtl"
    >
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors w-fit font-medium"
      >
        <ArrowRight className="w-5 h-5" />
        <span>إلغاء والعودة للجريدة</span>
      </button>

      <DashPanel className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
          إنشاء مقال جديد
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 font-medium">عنوان المقال *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="اكتب عنواناً جذاباً لمقالك..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 font-medium">القسم *</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="" disabled>
                  اختر القسم المناسب
                </option>

                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}

                {categories.length === 0 && (
                  <>
                    <option value="Criminal Law">Criminal Law</option>
                    <option value="Civil Law">Civil Law</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-700 font-medium">
                رابط صورة الغلاف (URL)
              </label>

              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 font-medium">
              الكلمات المفتاحية (Tags)
            </label>

            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              placeholder="محكمة, قانون العمل, قضايا"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 font-medium">المحتوى *</label>

            <textarea
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              placeholder="اكتب محتوى المقال هنا..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{isSubmitting ? "جاري النشر..." : "نشر المقال"}</span>
          </button>
        </form>
      </DashPanel>
    </div>
  );
}
