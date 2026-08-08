'use client';

type Props = {
  label: string;
  value: string;
  dir?: 'rtl' | 'ltr' | 'auto';
  compact?: boolean;
};

export default function ProfileField({
  label,
  value,
  dir = 'auto',
  compact = false,
}: Props) {
  if (compact) {
    return (
      <div className="flex items-start justify-between gap-3 border-b border-brand/8 py-2.5 last:border-b-0 dark:border-white/8">
        <p className="shrink-0 text-[11px] font-semibold text-muted">{label}</p>
        <p
          className="min-w-0 break-words text-end text-sm font-medium text-foreground"
          dir={dir}
        >
          {value || '—'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand/12 bg-surface-raised px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1.5 break-words text-sm font-medium text-foreground" dir={dir}>
        {value || '—'}
      </p>
    </div>
  );
}
