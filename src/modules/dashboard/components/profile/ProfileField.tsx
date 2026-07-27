'use client';

type Props = {
  label: string;
  value: string;
  dir?: 'rtl' | 'ltr' | 'auto';
};

export default function ProfileField({ label, value, dir = 'auto' }: Props) {
  return (
    <div className="rounded-xl border border-brand/10 bg-[#f7f9ff] px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1.5 break-words text-sm font-medium text-foreground" dir={dir}>
        {value || '—'}
      </p>
    </div>
  );
}
