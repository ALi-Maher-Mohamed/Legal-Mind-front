'use client';

import {
  BookOpen,
  FileSearch,
  MessageSquareText,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { DashboardView } from '@/types/dashboard.types';
import DashPanel from '../ui/DashPanel';

type Props = {
  onNavigate: (view: DashboardView) => void;
};

const SHORTCUTS: Array<{
  view: Exclude<DashboardView, 'dashboard' | 'profile'>;
  labelKey: 'navConsultation' | 'navAnalysis' | 'navDrafter' | 'navGazette';
  desc: string;
  icon: LucideIcon;
}> = [
  {
    view: 'consultation',
    labelKey: 'navConsultation',
    desc: 'بدء استشارة قانونية',
    icon: MessageSquareText,
  },
  {
    view: 'analysis',
    labelKey: 'navAnalysis',
    desc: 'تدقيق المستندات',
    icon: FileSearch,
  },
  {
    view: 'drafter',
    labelKey: 'navDrafter',
    desc: 'صياغة العقود والمذكرات',
    icon: BookOpen,
  },
  {
    view: 'gazette',
    labelKey: 'navGazette',
    desc: 'تصفح المقالات والمنشورات',
    icon: Newspaper,
  },
];

export default function DeskShortcuts({ onNavigate }: Props) {
  const { t } = useLanguage();

  return (
    <DashPanel className="!p-4">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
        مساحة العمل
      </h2>
      <ul className="space-y-1.5">
        {SHORTCUTS.map(({ view, labelKey, desc, icon: Icon }) => (
          <li key={view}>
            <button
              type="button"
              onClick={() => onNavigate(view)}
              className="flex w-full items-center gap-3 rounded-xl border border-transparent px-2.5 py-2.5 text-start transition hover:border-brand/15 hover:bg-brand/5 cursor-pointer dark:hover:border-white/10 dark:hover:bg-white/5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/12 bg-surface-raised text-brand dark:border-white/10 dark:bg-white/5">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-foreground">
                  {t.dashboard[labelKey]}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-muted">
                  {desc}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </DashPanel>
  );
}
