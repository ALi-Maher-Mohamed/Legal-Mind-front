import type { LucideIcon } from 'lucide-react';
import { Shield, FileText, Cpu, Search, HelpCircle, Activity } from 'lucide-react';

export type ServiceItem = {
  key: 'docAnalysis' | 'contractGen' | 'consultation' | 'govGuide' | 'termExplainer' | 'caseTracker';
  icon: LucideIcon;
  iconClass: string;
  glow: string;
};

export const SERVICES: ServiceItem[] = [
  { key: 'docAnalysis', icon: Shield, iconClass: 'text-blue-400', glow: 'rgba(59, 130, 246, 0.18)' },
  { key: 'contractGen', icon: FileText, iconClass: 'text-purple-400', glow: 'rgba(139, 92, 246, 0.18)' },
  { key: 'consultation', icon: Cpu, iconClass: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.18)' },
  { key: 'govGuide', icon: Search, iconClass: 'text-[#F6C453]', glow: 'rgba(246, 196, 83, 0.18)' },
  { key: 'termExplainer', icon: HelpCircle, iconClass: 'text-pink-400', glow: 'rgba(244, 63, 94, 0.18)' },
  { key: 'caseTracker', icon: Activity, iconClass: 'text-orange-400', glow: 'rgba(249, 115, 22, 0.18)' },
];
