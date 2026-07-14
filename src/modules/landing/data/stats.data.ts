import type { LucideIcon } from 'lucide-react';
import { Users, FileCheck, Award } from 'lucide-react';

export type StatItem = {
  id: string;
  target: number;
  suffix: string;
  labelKey: 'users' | 'consultations' | 'satisfaction';
  icon: LucideIcon;
  iconClass: string;
  glow: string;
};

export const STATS: StatItem[] = [
  { id: 'users', target: 10000, suffix: '+', labelKey: 'users', icon: Users, iconClass: 'text-blue-400 animate-pulse', glow: 'rgba(59, 130, 246, 0.15)' },
  { id: 'consultations', target: 50000, suffix: '+', labelKey: 'consultations', icon: FileCheck, iconClass: 'text-purple-400', glow: 'rgba(139, 92, 246, 0.15)' },
  { id: 'satisfaction', target: 98, suffix: '%', labelKey: 'satisfaction', icon: Award, iconClass: 'text-[#F6C453]', glow: 'rgba(246, 196, 83, 0.15)' },
];
