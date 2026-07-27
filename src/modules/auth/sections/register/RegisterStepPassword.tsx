'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import AuthInput from '../../components/AuthInput';
import PasswordRulesList from '../../components/PasswordRulesList';
import type { RegisterDraft } from '@/types/auth.types';

type Props = {
  draft: RegisterDraft;
  onChange: <K extends keyof RegisterDraft>(key: K, value: RegisterDraft[K]) => void;
};

export default function RegisterStepPassword({ draft, onChange }: Props) {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4 pt-2">
      <div className="text-start">
        <p className="text-sm font-semibold text-foreground">{t.auth.passwordStepTitle}</p>
        <p className="mt-1 text-xs text-muted">{t.auth.passwordStepSubtitle}</p>
      </div>

      <AuthInput
        type={showPassword ? 'text' : 'password'}
        value={draft.password}
        onChange={(e) => onChange('password', e.target.value)}
        placeholder={t.auth.regPasswordPlaceholder}
        required
        icon={<Lock className="h-4 w-4" />}
        autoComplete="new-password"
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="rounded-lg p-1.5 text-muted hover:text-foreground cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      <PasswordRulesList password={draft.password} />
    </div>
  );
}
