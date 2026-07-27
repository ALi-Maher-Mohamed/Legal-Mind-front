'use client';

import { useState, useCallback } from 'react';
import type { RegisterDraft } from '@/types/auth.types';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';

const initialDraft: RegisterDraft = {
  name: '',
  email: '',
  password: '',
  phone: '',
  firmName: '',
  barId: '',
  teamSize: 'small',
  lawyerIdDocument: null,
  selectedPractices: [],
};

function validateStep(step: number, draft: RegisterDraft): string | null {
  if (step === 1) {
    if (!draft.name.trim() || !draft.email.trim() || !draft.password || !draft.phone.trim()) {
      return 'أكمل بياناتك الشخصية بما فيها رقم الهاتف';
    }
    if (draft.password.length < 6) {
      return 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل';
    }
  }
  if (step === 2) {
    if (!draft.firmName.trim()) return 'أدخل اسم المكتب';
    if (!draft.lawyerIdDocument) return 'ارفع مستند هوية المحامي';
  }
  return null;
}

export function useRegisterForm(onComplete: () => void) {
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
    const validationError = validateStep(step, draft);
    if (validationError) {
      toastApiError(new Error(validationError));
      return;
    }

    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.register(draft);
      toastApiSuccess(result.message);
      onComplete();
    } catch (error) {
      toastApiError(error, 'تعذّر إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return { step, draft, updateField, togglePractice, goBack, goNext, isLoading };
}
