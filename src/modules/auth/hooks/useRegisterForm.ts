'use client';

import { useState, useCallback } from 'react';
import type { RegisterDraft } from '@/types/auth.types';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { validateRegisterStep } from '../lib/validation';

const TOTAL_STEPS = 4;

const initialDraft: RegisterDraft = {
  name: '',
  email: '',
  password: '',
  phone: '',
  firmName: '',
  barId: '',
  teamSize: 'solo',
  lawyerIdDocument: null,
  selectedPractices: [],
};

export function useRegisterForm(onComplete: (email: string) => void) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<RegisterDraft>(initialDraft);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = useCallback(<K extends keyof RegisterDraft>(key: K, value: RegisterDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const togglePractice = useCallback((practice: string) => {
    setDraft((prev) => ({
      ...prev,
      selectedPractices: prev.selectedPractices.includes(practice)
        ? prev.selectedPractices.filter((item) => item !== practice)
        : [...prev.selectedPractices, practice],
    }));
  }, []);

  const goBack = () => setStep((prev) => Math.max(1, prev - 1));

  const goNext = async () => {
    const validationError = validateRegisterStep(step, draft);
    if (validationError) {
      toastApiError(new Error(validationError));
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.register(draft);
      toastApiSuccess(result.message);
      onComplete(draft.email.trim());
    } catch (error) {
      toastApiError(error, 'تعذّر إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    totalSteps: TOTAL_STEPS,
    draft,
    updateField,
    togglePractice,
    goBack,
    goNext,
    isLoading,
  };
}
