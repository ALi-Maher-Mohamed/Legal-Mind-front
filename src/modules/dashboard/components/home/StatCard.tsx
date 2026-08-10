import { dashAccentBar } from '../../lib/panelStyles';
import DashPanel from '../ui/DashPanel';

type Props = {
  label: string;
  value: number | string;
  change: string;
  icon: React.ReactNode;
  loading?: boolean;
};

export default function StatCard({
  label,
  value,
  change,
  icon,
  loading = false,
}: Props) {
  return (
    <DashPanel className="relative overflow-hidden !p-5">
      <div className={dashAccentBar} />
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
        <div className="rounded-lg border border-brand/15 bg-surface-raised p-1.5 text-brand dark:border-white/10 dark:bg-brand/15">
          {icon}
        </div>
      </div>
      <div
        className={`mt-2 text-3xl font-bold tabular-nums text-foreground ${loading ? 'animate-pulse text-muted' : ''}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[11px] text-brand">{change}</div>
    </DashPanel>
  );
}
