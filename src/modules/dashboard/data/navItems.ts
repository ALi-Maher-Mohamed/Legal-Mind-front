import {
  LayoutDashboard,
  MessageSquare,
  ScanSearch,
  PenLine,
  Newspaper,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import type { DashboardView } from '@/types/dashboard.types';

export type NavLabelKey =
  | 'navDashboard'
  | 'navConsultation'
  | 'navAnalysis'
  | 'navDrafter'
  | 'navGazette'
  | 'navProfile';

export type NavItem = {
  id: DashboardView;
  icon: LucideIcon;
  labelKey: NavLabelKey;
};

export const DASH_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'navDashboard' },
  { id: 'consultation', icon: MessageSquare, labelKey: 'navConsultation' },
  { id: 'analysis', icon: ScanSearch, labelKey: 'navAnalysis' },
  { id: 'drafter', icon: PenLine, labelKey: 'navDrafter' },
  { id: 'gazette', icon: Newspaper, labelKey: 'navGazette' },
  { id: 'profile', icon: UserRound, labelKey: 'navProfile' },
];
