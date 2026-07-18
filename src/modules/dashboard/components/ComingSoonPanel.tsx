'use client';

import { useLanguage } from '@/hooks/useLanguage';
import type { DashboardView } from '@/types/dashboard.types';
import DashPanel from './ui/DashPanel';

const TITLE_KEY: Record<Exclude<DashboardView, 'dashboard'>, 'navConsultation' | 'navEvidence' | 'navDrafter' | 'navGazette' | 'navSettings'> = {
  consultation: 'navConsultation',
  evidence: 'navEvidence',
  drafter: 'navDrafter',
  gazette: 'navGazette',
  settings: 'navSettings',
};

type Props = {
  view: Exclude<DashboardView, 'dashboard'>;
  onBack: () => void;
};

export default function ComingSoonPanel({ view, onBack }: Props) {
  const { t } = useLanguage();

  return (
    <DashPanel className="mx-auto max-w-lg !p-10 text-center">
      <h2 className="text-xl font-bold text-foreground">{t.dashboard[TITLE_KEY[view]]}</h2>
      <p className="mt-2 text-sm text-muted">{t.dashboard.comingSoon}</p>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand hover:opacity-90 cursor-pointer"
      >
        {t.dashboard.backDesk}
      </button>
    </DashPanel>
  );
}
