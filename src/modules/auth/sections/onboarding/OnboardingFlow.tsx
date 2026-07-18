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
  const { slide, setSlide, total, isLast, next, prev, skip, slides } = useOnboarding(onComplete);
  const current = slides[slide];
  const content = t.auth.slides[current.key];
  const Icon = current.icon;

  return (
    <div className="space-y-7 py-2">
      <div className="flex items-start justify-between gap-3">
        <div className="text-start">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-brand">
            {t.auth.onboardBadge}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {t.auth.onboardTitle}
          </h1>
        </div>
        {!isLast && (
          <button
            type="button"
            onClick={skip}
            className="shrink-0 rounded-lg border border-brand/15 bg-[#f0f4ff] px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand hover:text-on-brand dark:border-white/10 dark:bg-white/5 cursor-pointer"
          >
            {t.auth.skipOnboarding}
          </button>
        )}
      </div>

      <OnboardingSlide
        slideKey={current.key}
        title={content.title}
        desc={content.desc}
        icon={<Icon className="h-10 w-10" strokeWidth={1.5} />}
        step={slide + 1}
        total={total}
      />

      <OnboardingNav
        slide={slide}
        total={total}
        isLast={isLast}
        onPrev={prev}
        onNext={next}
        onSkip={skip}
        onDot={setSlide}
      />
    </div>
  );
}
