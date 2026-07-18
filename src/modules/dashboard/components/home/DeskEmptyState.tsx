import { Inbox } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import DashPanel from '../ui/DashPanel';

type Props = { onEnterEvidence: () => void };

export default function DeskEmptyState({ onEnterEvidence }: Props) {
  const { t } = useLanguage();

  return (
    <DashPanel className="flex flex-col items-center !p-12 text-center">
      <Inbox className="mb-4 h-12 w-12 text-accent" strokeWidth={1.5} />
      <h2 className="text-xl font-bold text-foreground">{t.dashboard.emptyTitle}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{t.dashboard.uploadFirst}</p>
      <button
        type="button"
        onClick={onEnterEvidence}
        className="mt-6 rounded-lg bg-brand px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-on-brand hover:opacity-90 cursor-pointer"
      >
        {t.dashboard.enterEvidence}
      </button>
    </DashPanel>
  );
}
