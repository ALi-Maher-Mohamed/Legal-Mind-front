'use client';

type PracticeChipProps = {
  label: string;
  selected: boolean;
  onToggle: () => void;
};

export default function PracticeChip({ label, selected, onToggle }: PracticeChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`text-xs px-3 py-2 border rounded-xl transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
        selected
          ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-medium'
          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );
}
