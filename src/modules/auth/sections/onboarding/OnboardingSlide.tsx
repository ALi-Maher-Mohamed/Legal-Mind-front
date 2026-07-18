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
    <Card className="p-6 md:p-8 text-center flex flex-col items-center bg-white border border-brand/15 dark:bg-white/5 dark:border-white/10">
      <div className="mb-6 p-4 rounded-2xl bg-[#f0f4ff] border border-brand/15 text-brand dark:bg-brand/15 dark:border-brand/25">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-muted text-sm leading-relaxed max-w-sm">{desc}</p>
    </Card>
  );
}
