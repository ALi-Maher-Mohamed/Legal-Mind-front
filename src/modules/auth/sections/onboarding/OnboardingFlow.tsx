'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { useOnboarding } from '../../hooks/useOnboarding';
import OnboardingSlide from './OnboardingSlide';
import OnboardingNav from './OnboardingNav';

type Props = {
  onComplete: () => void;
};

export default function OnboardingFlow({ onComplete }: Props) {
  const { t } = useLanguage();
  const { slide, setSlide, total, isLast, next, prev, slides } = useOnboarding(onComplete);
  const current = slides[slide];
  const content = t.auth.slides[current.key];
  const Icon = current.icon;

  return (
    <div className="space-y-8 py-2">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand block mb-2">
          {t.auth.onboardBadge}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.auth.onboardTitle}</h1>
      </div>

      <OnboardingSlide
        slideKey={current.key}
        title={content.title}
        desc={content.desc}
        icon={<Icon className="h-12 w-12" strokeWidth={1.5} />}
      />

      <OnboardingNav
        slide={slide}
        total={total}
        isLast={isLast}
        onPrev={prev}
        onNext={next}
        onDot={setSlide}
      />
    </div>
  );
}
