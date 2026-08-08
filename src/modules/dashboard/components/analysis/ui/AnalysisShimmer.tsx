'use client';

type BoneProps = {
  className?: string;
};

export function ShimmerBone({ className = '' }: BoneProps) {
  return <div className={`lm-shimmer rounded-md ${className}`} aria-hidden />;
}

export function LibraryGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label="جاري التحميل"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-brand/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <ShimmerBone className="h-8 w-8 rounded-lg" />
            <ShimmerBone className="h-5 w-16 rounded-full" />
          </div>
          <ShimmerBone className="mb-2 h-4 w-3/4" />
          <ShimmerBone className="mb-5 h-3 w-1/2" />
          <div className="flex items-center justify-between border-t border-brand/10 pt-3 dark:border-white/10">
            <ShimmerBone className="h-3 w-20" />
            <ShimmerBone className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LibraryListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-brand/10 bg-white dark:border-white/10 dark:bg-white/5"
      aria-busy="true"
      aria-label="جاري التحميل"
    >
      <div className="h-10 bg-brand/80" />
      <div className="divide-y divide-brand/10 dark:divide-white/10">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.4fr_0.7fr_0.5fr_0.7fr] items-center gap-3 px-4 py-4"
          >
            <ShimmerBone className="h-4 w-full max-w-[14rem]" />
            <ShimmerBone className="hidden h-3 w-20 md:block" />
            <ShimmerBone className="hidden h-3 w-14 sm:block" />
            <ShimmerBone className="h-7 w-24 justify-self-end rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function UploadSkeleton() {
  return (
    <div className="mx-auto max-w-sm space-y-3 py-4" aria-busy="true">
      <ShimmerBone className="mx-auto h-10 w-10 rounded-xl" />
      <ShimmerBone className="mx-auto h-4 w-48" />
      <ShimmerBone className="h-2 w-full rounded-full" />
      <ShimmerBone className="mx-auto h-3 w-24" />
    </div>
  );
}

export function AuditViewSkeleton({ onBack }: { onBack?: () => void }) {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="جاري تحميل نتائج التحليل">
      <div className="flex flex-col gap-4 border-b border-brand/15 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
        <div className="flex items-start gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="h-10 w-10 rounded-lg border border-brand/15 bg-white dark:border-white/10 dark:bg-white/5 cursor-pointer"
              aria-label="رجوع"
            >
              <span className="lm-shimmer mx-auto block h-4 w-4 rounded" />
            </button>
          ) : (
            <ShimmerBone className="h-10 w-10 rounded-lg" />
          )}
          <div className="space-y-2">
            <ShimmerBone className="h-4 w-28" />
            <ShimmerBone className="h-6 w-56 sm:w-72" />
          </div>
        </div>
        <div className="flex gap-2">
          <ShimmerBone className="h-9 w-28 rounded-lg" />
          <ShimmerBone className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="rounded-2xl border border-brand/10 bg-white p-5 dark:border-white/10 dark:bg-white/5 lg:col-span-6">
          <ShimmerBone className="mb-4 h-4 w-40" />
          <div className="space-y-4">
            <ShimmerBone className="h-3 w-full" />
            <ShimmerBone className="h-3 w-5/6" />
            <ShimmerBone className="h-3 w-4/5" />
            <ShimmerBone className="h-24 w-full rounded-xl" />
            <ShimmerBone className="h-3 w-3/4" />
            <ShimmerBone className="h-3 w-full" />
            <ShimmerBone className="h-20 w-full rounded-xl" />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-brand/10 bg-white dark:border-white/10 dark:bg-white/5 lg:col-span-6">
          <div className="flex gap-2 border-b border-brand/10 bg-surface-raised p-3 dark:border-white/10 dark:bg-white/5">
            <ShimmerBone className="h-8 w-20 rounded-lg" />
            <ShimmerBone className="h-8 w-20 rounded-lg" />
            <ShimmerBone className="h-8 w-20 rounded-lg" />
            <ShimmerBone className="h-8 w-24 rounded-lg" />
          </div>
          <div className="space-y-4 p-5">
            <ShimmerBone className="h-16 w-40 rounded-xl" />
            <ShimmerBone className="h-4 w-48" />
            <ShimmerBone className="h-20 w-full rounded-xl" />
            <ShimmerBone className="h-3 w-full" />
            <ShimmerBone className="h-3 w-5/6" />
            <ShimmerBone className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
