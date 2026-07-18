'use client';

import { Briefcase, Scale } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import AuthInput from '../../components/AuthInput';
import type { RegisterDraft } from '@/types/auth.types';

type Props = {
  draft: RegisterDraft;
  onChange: <K extends keyof RegisterDraft>(key: K, value: RegisterDraft[K]) => void;
};

export default function RegisterStepFirm({ draft, onChange }: Props) {
  const { t, isRtl } = useLanguage();

  return (
    <div className="space-y-4 pt-2">
      <AuthInput
        type="text"
        value={draft.firmName}
        onChange={(e) => onChange('firmName', e.target.value)}
        placeholder={t.auth.firmPlaceholder}
        required
        isRtl={isRtl}
        icon={<Briefcase className="h-4 w-4" />}
      />
      <AuthInput
        type="text"
        value={draft.barId}
        onChange={(e) => onChange('barId', e.target.value)}
        placeholder={t.auth.barIdPlaceholder}
        isRtl={isRtl}
        icon={<Scale className="h-4 w-4" />}
      />
      <div>
        <label className="text-xs text-gray-500 block mb-2 text-start">
          {t.auth.teamSizeLabel}
        </label>
        <select
          value={draft.teamSize}
          onChange={(e) => onChange('teamSize', e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 py-3 px-4 text-sm text-white text-start focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="1" className="bg-[#181818]">{t.auth.teamSolo}</option>
          <option value="2-10" className="bg-[#181818]">{t.auth.teamBoutique}</option>
          <option value="11-50" className="bg-[#181818]">{t.auth.teamRegional}</option>
          <option value="51+" className="bg-[#181818]">{t.auth.teamCorporate}</option>
        </select>
      </div>
    </div>
  );
}
