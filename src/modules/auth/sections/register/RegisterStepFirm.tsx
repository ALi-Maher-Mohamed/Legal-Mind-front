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
  const { t } = useLanguage();

  return (
    <div className="space-y-4 pt-2">
      <AuthInput
        type="text"
        value={draft.firmName}
        onChange={(e) => onChange('firmName', e.target.value)}
        placeholder={t.auth.firmPlaceholder}
        required
        icon={<Briefcase className="h-4 w-4" />}
      />
      <AuthInput
        type="text"
        value={draft.barId}
        onChange={(e) => onChange('barId', e.target.value)}
        placeholder={t.auth.barIdPlaceholder}
        icon={<Scale className="h-4 w-4" />}
      />
      <div>
        <label className="text-xs text-muted block mb-2 text-start">{t.auth.teamSizeLabel}</label>
        <select
          value={draft.teamSize}
          onChange={(e) => onChange('teamSize', e.target.value)}
          className="w-full rounded-lg border border-brand/15 bg-white py-3 px-4 text-sm text-foreground text-start shadow-[0_1px_2px_rgba(0,62,199,0.04)] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition dark:border-white/10 dark:bg-white/5 dark:text-[#dae2fd] dark:shadow-none"
        >
          <option value="1" className="bg-white text-foreground dark:bg-[#0b1326] dark:text-[#dae2fd]">
            {t.auth.teamSolo}
          </option>
          <option value="2-10" className="bg-white text-foreground dark:bg-[#0b1326] dark:text-[#dae2fd]">
            {t.auth.teamBoutique}
          </option>
          <option value="11-50" className="bg-white text-foreground dark:bg-[#0b1326] dark:text-[#dae2fd]">
            {t.auth.teamRegional}
          </option>
          <option value="51+" className="bg-white text-foreground dark:bg-[#0b1326] dark:text-[#dae2fd]">
            {t.auth.teamCorporate}
          </option>
        </select>
      </div>
    </div>
  );
}
