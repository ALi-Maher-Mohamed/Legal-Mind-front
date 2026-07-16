'use client';

import { useState, useCallback } from 'react';
import type { RegisterDraft } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

const initialDraft: RegisterDraft = {
  name: '',
  email: '',
  password: '',
  firmName: '',
  barId: '',
  teamSize: '1',
  selectedPractices: [],
};

export function useRegisterForm(onComplete: (draft: RegisterDraft) => void) {
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
        ? prev.selectedPractices.filter((p) => p !== practice)
        : [...prev.selectedPractices, practice],
    }));
  }, []);

  const goBack = () => setStep((prev) => Math.max(1, prev - 1));

  const goNext = async () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }
    setIsLoading(true);
    try {
      await authService.register(draft);
      onComplete(draft);
    } finally {
      setIsLoading(false);
    }
  };

  return { step, draft, updateField, togglePractice, goBack, goNext, isLoading };
}
