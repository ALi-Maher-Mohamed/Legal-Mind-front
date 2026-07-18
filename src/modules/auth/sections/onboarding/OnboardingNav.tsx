"use client";

import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui";

type Props = {
  slide: number;
  total: number;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
  onDot: (index: number) => void;
};

export default function OnboardingNav({
  slide,
  total,
  isLast,
  onPrev,
  onNext,
  onSkip,
  onDot,
}: Props) {
  const { t, isRtl } = useLanguage();
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-2" role="tablist">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === slide}
            onClick={() => onDot(index)}
            className={`h-2 rounded-full transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
              index === slide
                ? "w-7 bg-brand"
                : "w-2 bg-brand/20 hover:bg-brand/40 dark:bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* <div className="flex items-center justify-between gap-3"> */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={isLast ? "gold" : "primary"}
          size="md"
          onClick={onNext}
        >
          <span className="flex items-center gap-1.5">
            {isLast ? t.auth.enterApp : t.auth.continue}
            {isLast ? (
              <Check className="h-4 w-4" />
            ) : (
              <NextIcon className="h-4 w-4" />
            )}
          </span>
        </Button>
      </div>
    </div>
  );
}
