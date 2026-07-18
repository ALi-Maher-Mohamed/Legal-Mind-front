type Props = {
  checked: boolean;
  onToggle: () => void;
  leftLabel: string;
  rightLabel: string;
  ariaLabel: string;
  className?: string;
};

/** Reusable two-option pill switch (language, theme, etc.) */
export default function SegmentSwitch({
  checked,
  onToggle,
  leftLabel,
  rightLabel,
  ariaLabel,
  className = '',
}: Props) {
  return (
    <button
      type="button"
      role="switch"
      dir="ltr"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onToggle}
      className={`relative inline-flex h-9 w-[5.5rem] items-center rounded-full border border-brand/15 bg-[#f0f4ff] p-1 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:border-white/10 dark:bg-white/5 ${className}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute top-1 bottom-1 start-1 w-[calc(50%-4px)] rounded-full bg-brand shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      <span
        className={`relative z-10 flex-1 text-center text-[10px] font-semibold ${
          !checked ? 'text-on-brand' : 'text-muted'
        }`}
      >
        {leftLabel}
      </span>
      <span
        className={`relative z-10 flex-1 text-center text-[10px] font-semibold ${
          checked ? 'text-on-brand' : 'text-muted'
        }`}
      >
        {rightLabel}
      </span>
    </button>
  );
}
