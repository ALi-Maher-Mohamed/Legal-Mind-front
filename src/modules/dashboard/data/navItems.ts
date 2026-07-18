import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  PenLine,
  Newspaper,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import type { DashboardView } from '@/types/dashboard.types';

export type NavLabelKey =
  | 'navDashboard'
  | 'navConsultation'
  | 'navEvidence'
  | 'navDrafter'
  | 'navGazette'
  | 'navSettings';

export type NavItem = {
  id: DashboardView;
  icon: LucideIcon;
  labelKey: NavLabelKey;
};

export const DASH_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'navDashboard' },
  { id: 'consultation', icon: MessageSquare, labelKey: 'navConsultation' },
  { id: 'evidence', icon: FolderOpen, labelKey: 'navEvidence' },
  { id: 'drafter', icon: PenLine, labelKey: 'navDrafter' },
  { id: 'gazette', icon: Newspaper, labelKey: 'navGazette' },
  { id: 'settings', icon: Settings, labelKey: 'navSettings' },
];
