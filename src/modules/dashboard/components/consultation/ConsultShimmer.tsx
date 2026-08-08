'use client';

import { dashPanel } from '../../lib/panelStyles';

function Bone({ className = '' }: { className?: string }) {
  return <div className={`lm-shimmer rounded-md ${className}`} aria-hidden />;
}

function MessageBubbleSkeleton({
  align = 'start',
  wide = false,
}: {
  align?: 'start' | 'end';
  wide?: boolean;
}) {
  const isEnd = align === 'end';
  return (
    <div className={`flex ${isEnd ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`${dashPanel} w-full space-y-3 border-s-4 p-4 sm:p-5 ${
          isEnd ? 'ms-auto max-w-lg border-s-brand' : 'max-w-xl border-s-accent'
        } ${wide ? 'max-w-2xl' : ''}`}
      >
        <div className="flex items-center gap-2">
          <Bone className="h-7 w-7 shrink-0 rounded-lg" />
          <Bone className="h-3 w-20" />
          <Bone className="ms-auto h-3 w-12" />
        </div>
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-11/12" />
        <Bone className="h-3 w-4/5" />
        {!isEnd ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <Bone className="h-6 w-24 rounded-full" />
            <Bone className="h-6 w-20 rounded-full" />
            <Bone className="h-6 w-16 rounded-full" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ConversationListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="جاري تحميل الجلسات">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-brand/15 bg-surface-raised p-3 dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex items-start gap-2">
            <Bone className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded" />
            <div className="min-w-0 flex-1 space-y-2">
              <Bone className={`h-3.5 ${['w-4/5', 'w-3/5', 'w-full'][index % 3]}`} />
              <Bone className="h-2.5 w-16" />
              <Bone className="h-2.5 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageThreadSkeleton({
  bubbles = 4,
  compact = false,
}: {
  bubbles?: number;
  compact?: boolean;
}) {
  const pattern: Array<'start' | 'end'> = ['end', 'start', 'end', 'start', 'end', 'start'];
  return (
    <div
      className={
        compact
          ? 'w-full space-y-4'
          : 'my-4 flex min-h-0 flex-1 flex-col space-y-6 overflow-hidden'
      }
      aria-busy="true"
      aria-label="جاري تحميل الرسائل"
    >
      {Array.from({ length: bubbles }).map((_, index) => (
        <MessageBubbleSkeleton
          key={index}
          align={pattern[index % pattern.length]}
          wide={index % 2 === 1}
        />
      ))}
    </div>
  );
}

export function TypingDotsSkeleton() {
  return (
    <div
      className={`${dashPanel} flex max-w-xl items-center gap-3 border-s-4 border-s-accent p-5`}
      aria-busy="true"
      aria-label="جاري كتابة الرد"
    >
      <Bone className="h-8 w-8 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 space-y-2.5">
        <Bone className="h-3 w-full max-w-[12rem]" />
        <Bone className="h-3 w-full max-w-[18rem]" />
        <div className="flex items-center gap-2 pt-0.5">
          <span className="lm-shimmer h-1.5 w-1.5 rounded-full" />
          <span className="lm-shimmer h-1.5 w-1.5 rounded-full" />
          <span className="lm-shimmer h-1.5 w-1.5 rounded-full" />
          <span className="text-[10px] text-muted">…</span>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceHeaderSkeleton() {
  return (
    <div
      className={`${dashPanel} flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5`}
      aria-hidden
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Bone className="h-2 w-2 rounded-full" />
          <Bone className="h-4 w-40 sm:w-56" />
        </div>
        <Bone className="h-2.5 w-32" />
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={i} className="h-9 w-9 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function ComposerSkeleton() {
  return (
    <div
      className={`${dashPanel} shrink-0 p-3 sm:p-4`}
      aria-hidden
    >
      <Bone className="mb-2 h-20 w-full rounded-xl" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Bone className="h-9 w-9 rounded-lg" />
          <Bone className="h-9 w-9 rounded-lg" />
        </div>
        <Bone className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/** Full consultation shell skeleton — matches ActiveWorkspace layout. */
export default function ConsultationRoomSkeleton() {
  return (
    <div
      className="relative flex h-[calc(100vh-10rem)] flex-1 gap-4 overflow-hidden sm:h-[calc(100vh-11rem)] md:gap-6"
      aria-busy="true"
      aria-label="جاري تحميل غرفة المشورة"
    >
      <aside
        className={`${dashPanel} hidden h-full w-64 shrink-0 flex-col overflow-hidden p-3 sm:p-4 lg:flex xl:w-72`}
      >
        <div className="mb-3 flex items-center justify-between border-b border-brand/10 pb-3 dark:border-white/10">
          <Bone className="h-4 w-28" />
          <Bone className="h-5 w-8 rounded" />
        </div>
        <Bone className="mb-3 h-9 w-full rounded-xl" />
        <Bone className="mb-3 h-10 w-full rounded-lg" />
        <div className="min-h-0 flex-1 overflow-hidden">
          <ConversationListSkeleton rows={7} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceHeaderSkeleton />
        <MessageThreadSkeleton />
        <ComposerSkeleton />
      </div>

      <aside
        className={`${dashPanel} hidden h-full w-56 shrink-0 flex-col overflow-hidden p-4 xl:flex`}
      >
        <Bone className="mb-3 h-4 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-brand/10 p-3 dark:border-white/10">
              <Bone className="h-3 w-3/4" />
              <Bone className="h-2.5 w-full" />
              <Bone className="h-2.5 w-5/6" />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
