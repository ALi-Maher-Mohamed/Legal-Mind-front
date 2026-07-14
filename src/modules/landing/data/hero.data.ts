import type { LucideIcon } from 'lucide-react';
import { Shield, FileText, Cpu, Search, HelpCircle, Activity } from 'lucide-react';

export type HeroFeatureKey =
  | 'analyzeDocs'
  | 'generateContracts'
  | 'legalConsultation'
  | 'govGuide'
  | 'explainTerms'
  | 'caseTracking';

export type HeroFeature = {
  titleKey: HeroFeatureKey;
  icon: LucideIcon;
  iconClass: string;
  delay: number;
  hoverGlow: string;
};

export const HERO_FEATURES: HeroFeature[] = [
  { titleKey: 'analyzeDocs', icon: Shield, iconClass: 'text-blue-400', delay: 0, hoverGlow: 'rgba(59, 130, 246, 0.2)' },
  { titleKey: 'generateContracts', icon: FileText, iconClass: 'text-purple-400', delay: 0.2, hoverGlow: 'rgba(139, 92, 246, 0.2)' },
  { titleKey: 'legalConsultation', icon: Cpu, iconClass: 'text-emerald-400', delay: 0.4, hoverGlow: 'rgba(16, 185, 129, 0.2)' },
  { titleKey: 'govGuide', icon: Search, iconClass: 'text-[#F6C453]', delay: 0.1, hoverGlow: 'rgba(246, 196, 83, 0.2)' },
  { titleKey: 'explainTerms', icon: HelpCircle, iconClass: 'text-pink-400', delay: 0.3, hoverGlow: 'rgba(244, 63, 94, 0.2)' },
  { titleKey: 'caseTracking', icon: Activity, iconClass: 'text-orange-400', delay: 0.5, hoverGlow: 'rgba(249, 115, 22, 0.2)' },
];
