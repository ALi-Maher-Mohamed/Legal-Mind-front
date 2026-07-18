'use client';

type Props = {
  step: number;
  label: string;
  total?: number;
};

export default function StepProgress({ step, label, total = 3 }: Props) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">{label}</span>
      <div className="flex items-center gap-1.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < step ? 'bg-brand' : 'bg-brand/15 dark:bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
