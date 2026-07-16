import type { LucideIcon } from 'lucide-react';
import { Scale, Shield, Compass } from 'lucide-react';

export type OnboardingSlideKey = 'aiCounsel' | 'docAudit' | 'firmBrand';

export type OnboardingSlideMeta = {
  key: OnboardingSlideKey;
  icon: LucideIcon;
};

export const ONBOARDING_SLIDES: OnboardingSlideMeta[] = [
  { key: 'aiCounsel', icon: Scale },
  { key: 'docAudit', icon: Shield },
  { key: 'firmBrand', icon: Compass },
];

export const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256';
