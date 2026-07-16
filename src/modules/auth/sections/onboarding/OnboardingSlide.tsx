'use client';

import { Card } from '@/components/ui';
import type { OnboardingSlideKey } from '../../data/onboarding.data';

type Props = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  slideKey: OnboardingSlideKey;
};

export default function OnboardingSlide({ title, desc, icon }: Props) {
  return (
    <Card
      glowColor="rgba(59, 130, 246, 0.2)"
      className="p-6 md:p-8 border border-white/10 bg-[#181818]/60 text-center flex flex-col items-center"
    >
      <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">{icon}</div>
      <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
      <p className="text-gray-400 text-sm leading-relaxed max-w-sm">{desc}</p>
    </Card>
  );
}
