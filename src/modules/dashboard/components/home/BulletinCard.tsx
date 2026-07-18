import { Scale } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import DashPanel from '../ui/DashPanel';

type Props = { onInspect: () => void };

export default function BulletinCard({ onInspect }: Props) {
  const { t } = useLanguage();

  return (
    <DashPanel className="relative overflow-hidden">
      <div className="pointer-events-none absolute -me-4 -mt-4 end-0 top-0 h-24 w-24 opacity-5">
        <Scale className="h-full w-full text-foreground" />
      </div>
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-brand">
        {t.dashboard.bulletinLabel}
      </span>
      <h3 className="text-sm font-bold uppercase text-foreground">{t.dashboard.bulletinTitle}</h3>
      <p className="mt-2 text-xs italic leading-relaxed text-muted">{t.dashboard.bulletinDesc}</p>
      <button
        type="button"
        onClick={onInspect}
        className="mt-4 block text-xs font-bold uppercase tracking-wider text-brand hover:opacity-80 cursor-pointer"
      >
        {t.dashboard.inspectGazette}
      </button>
    </DashPanel>
  );
}
