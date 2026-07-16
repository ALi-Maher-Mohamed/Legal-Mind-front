'use client';

import { User, Mail, Lock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import AuthInput from '../../components/AuthInput';
import type { RegisterDraft } from '@/types/auth.types';

type Props = {
  draft: RegisterDraft;
  onChange: <K extends keyof RegisterDraft>(key: K, value: RegisterDraft[K]) => void;
};

export default function RegisterStepPersonal({ draft, onChange }: Props) {
  const { t, isRtl } = useLanguage();

  return (
    <div className="space-y-4 pt-2">
      <AuthInput
        type="text"
        value={draft.name}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder={t.auth.namePlaceholder}
        required
        isRtl={isRtl}
        icon={<User className="h-4 w-4" />}
        autoComplete="name"
      />
      <AuthInput
        type="email"
        value={draft.email}
        onChange={(e) => onChange('email', e.target.value)}
        placeholder={t.auth.regEmailPlaceholder}
        required
        isRtl={isRtl}
        icon={<Mail className="h-4 w-4" />}
        autoComplete="email"
      />
      <AuthInput
        type="password"
        value={draft.password}
        onChange={(e) => onChange('password', e.target.value)}
        placeholder={t.auth.regPasswordPlaceholder}
        required
        isRtl={isRtl}
        icon={<Lock className="h-4 w-4" />}
        autoComplete="new-password"
      />
    </div>
  );
}
