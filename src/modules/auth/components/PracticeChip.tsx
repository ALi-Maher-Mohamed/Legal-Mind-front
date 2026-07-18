'use client';

type Props = {
  label: string;
  selected: boolean;
  onToggle: () => void;
};

export default function PracticeChip({ label, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
        selected
          ? 'bg-brand text-on-brand border-brand shadow-[0_2px_8px_rgba(0,62,199,0.2)]'
          : 'bg-white text-muted border-brand/15 hover:border-brand/40 hover:text-foreground dark:bg-white/5 dark:border-white/10 dark:text-[#c4c6cf] dark:hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}
