import { Scale } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import DashPanel from '../ui/DashPanel';

type Props = { onInspect: () => void };

export default function BulletinCard({ onInspect }: Props) {
  const { t } = useLanguage();

  return (
    <DashPanel className="relative overflow-hidden !p-5">
      <div className="pointer-events-none absolute -end-3 -top-3 h-20 w-20 opacity-[0.06] dark:opacity-10">
        <Scale className="h-full w-full text-foreground" />
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
          {t.dashboard.bulletinLabel}
        </span>
      </div>

      <h3 className="text-sm font-bold leading-snug text-foreground">
        {t.dashboard.bulletinTitle}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        {t.dashboard.bulletinDesc}
      </p>

      <button
        type="button"
        onClick={onInspect}
        className="mt-4 inline-flex items-center gap-1 rounded-lg border border-brand/15 bg-brand/5 px-3 py-2 text-[11px] font-bold text-brand transition hover:bg-brand/10 cursor-pointer dark:border-white/15 dark:bg-white/5"
      >
        {t.dashboard.inspectGazette}
      </button>
    </DashPanel>
  );
}
