'use client';

import { useLanguage } from '@/hooks/useLanguage';
import StepProgress from '../../components/StepProgress';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import RegisterStepPersonal from './RegisterStepPersonal';
import RegisterStepPassword from './RegisterStepPassword';
import RegisterStepFirm from './RegisterStepFirm';
import RegisterStepPractices from './RegisterStepPractices';
import RegisterControls from './RegisterControls';

type Props = {
  onComplete: (email: string) => void;
  onLoginInstead: () => void;
};

export default function RegisterForm({ onComplete, onLoginInstead }: Props) {
  const { t } = useLanguage();
  const { step, totalSteps, draft, updateField, togglePractice, goBack, goNext, isLoading } =
    useRegisterForm(onComplete);

  const stepLabel = t.auth.stepOf
    .replace('{step}', String(step))
    .replace('{total}', String(totalSteps));

  return (
    <div className="space-y-6">
      <div className="text-start">
        <StepProgress step={step} label={stepLabel} total={totalSteps} />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mt-3">
          {t.auth.registerTitle}
        </h1>
      </div>

      {step === 1 && <RegisterStepPersonal draft={draft} onChange={updateField} />}
      {step === 2 && <RegisterStepPassword draft={draft} onChange={updateField} />}
      {step === 3 && <RegisterStepFirm draft={draft} onChange={updateField} />}
      {step === 4 && (
        <RegisterStepPractices selected={draft.selectedPractices} onToggle={togglePractice} />
      )}

      <RegisterControls
        step={step}
        totalSteps={totalSteps}
        isLoading={isLoading}
        onBack={goBack}
        onNext={goNext}
        onLoginInstead={onLoginInstead}
      />
    </div>
  );
}
