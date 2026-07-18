'use client';

import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui';

type Props = {
  slide: number;
  total: number;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDot: (index: number) => void;
};

export default function OnboardingNav({ slide, total, isLast, onPrev, onNext, onDot }: Props) {
  const { t, isRtl } = useLanguage();
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center gap-2" role="tablist">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === slide}
            onClick={() => onDot(index)}
            className={`h-2 rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
              index === slide ? 'w-6 bg-brand' : 'w-2 bg-brand/20 dark:bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="flex justify-between items-center pt-2">
        {slide > 0 ? (
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition"
          >
            <PrevIcon className="h-4 w-4" />
            {t.auth.priorStep}
          </button>
        ) : (
          <div className="w-10" />
        )}

        <Button type="button" variant={isLast ? 'gold' : 'primary'} size="md" onClick={onNext}>
          <span className="flex items-center gap-1.5">
            {isLast ? t.auth.enterApp : t.auth.continue}
            {isLast ? <Check className="h-4 w-4" /> : <NextIcon className="h-4 w-4" />}
          </span>
        </Button>
      </div>
    </div>
  );
}
