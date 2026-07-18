'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui';

type Props = {
  step: number;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
  onLoginInstead: () => void;
};

export default function RegisterControls({ step, isLoading, onBack, onNext, onLoginInstead }: Props) {
  const { t, isRtl } = useLanguage();
  const BackIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="flex justify-between items-center pt-6 gap-4">
      {step > 1 ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition"
        >
          <BackIcon className="h-4 w-4" />
          {t.auth.priorStep}
        </button>
      ) : (
        <button
          type="button"
          onClick={onLoginInstead}
          className="text-xs text-brand hover:opacity-80 transition"
        >
          {t.auth.loginInstead}
        </button>
      )}

      <Button type="button" variant="primary" size="md" isLoading={isLoading} onClick={onNext}>
        <span className="flex items-center gap-1.5">
          {step === 3 ? t.auth.enrollBtn : t.auth.nextStep}
          <NextIcon className="h-4 w-4" />
        </span>
      </Button>
    </div>
  );
}
