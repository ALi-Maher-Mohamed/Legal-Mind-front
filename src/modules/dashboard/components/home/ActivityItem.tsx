import type { DeskActivity } from '@/types/dashboard.types';

type Props = {
  activity: DeskActivity;
  expanded: boolean;
  expandLabel: string;
  collapseLabel: string;
  onToggle: () => void;
};

export default function ActivityItem({
  activity,
  expanded,
  expandLabel,
  collapseLabel,
  onToggle,
}: Props) {
  return (
    <button
      type="button"
      className="relative block w-full cursor-pointer text-start group"
      onClick={onToggle}
    >
      <span className="absolute -start-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand bg-background transition group-hover:bg-accent" />
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
          {activity.date} • {activity.time}
        </span>
        <span className="text-[10px] text-muted group-hover:text-foreground">
          {expanded ? collapseLabel : expandLabel}
        </span>
      </div>
      <h3 className="mt-1 text-sm font-bold uppercase tracking-tight text-foreground">
        {activity.title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">{activity.desc}</p>
      {expanded && (
        <div className="mt-3 rounded-lg border border-brand/15 border-s-2 border-s-accent bg-[#f0f4ff] p-3 text-xs italic leading-relaxed text-foreground dark:border-white/10 dark:bg-brand/10">
          {activity.detail}
        </div>
      )}
    </button>
  );
}
