'use client';

import { useLanguage } from '@/hooks/useLanguage';
import type { RegisterDraft } from '@/types/auth.types';
import StepProgress from '../../components/StepProgress';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import RegisterStepPersonal from './RegisterStepPersonal';
import RegisterStepFirm from './RegisterStepFirm';
import RegisterStepPractices from './RegisterStepPractices';
import RegisterControls from './RegisterControls';

type Props = {
  onComplete: (draft: RegisterDraft) => void;
  onLoginInstead: () => void;
};

export default function RegisterForm({ onComplete, onLoginInstead }: Props) {
  const { t } = useLanguage();
  const { step, draft, updateField, togglePractice, goBack, goNext, isLoading } =
    useRegisterForm(onComplete);

  const stepLabel = t.auth.stepOf.replace('{step}', String(step));

  return (
    <div className="space-y-6">
      <div className="text-start">
        <StepProgress step={step} label={stepLabel} />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mt-3">
          {t.auth.registerTitle}
        </h1>
      </div>

      {step === 1 && <RegisterStepPersonal draft={draft} onChange={updateField} />}
      {step === 2 && <RegisterStepFirm draft={draft} onChange={updateField} />}
      {step === 3 && (
        <RegisterStepPractices selected={draft.selectedPractices} onToggle={togglePractice} />
      )}

      <RegisterControls
        step={step}
        isLoading={isLoading}
        onBack={goBack}
        onNext={goNext}
        onLoginInstead={onLoginInstead}
      />
    </div>
  );
}
