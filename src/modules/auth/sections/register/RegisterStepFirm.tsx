'use client';

import { Briefcase, Scale, FileUp } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import AuthInput from '../../components/AuthInput';
import type { RegisterDraft, TeamSizeValue } from '@/types/auth.types';

type Props = {
  draft: RegisterDraft;
  onChange: <K extends keyof RegisterDraft>(key: K, value: RegisterDraft[K]) => void;
};

const TEAM_OPTIONS: { value: TeamSizeValue; labelKey: 'teamSolo' | 'teamBoutique' | 'teamRegional' | 'teamCorporate' }[] = [
  { value: 'small', labelKey: 'teamSolo' },
  { value: 'medium', labelKey: 'teamBoutique' },
  { value: 'large', labelKey: 'teamRegional' },
  { value: 'enterprise', labelKey: 'teamCorporate' },
];

export default function RegisterStepFirm({ draft, onChange }: Props) {
  const { t } = useLanguage();
  const fileName = draft.lawyerIdDocument?.name;

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
          onChange={(e) => onChange('teamSize', e.target.value as TeamSizeValue)}
          className="w-full rounded-lg border border-brand/15 bg-white py-3 px-4 text-sm text-foreground text-start shadow-[0_1px_2px_rgba(0,62,199,0.04)] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition dark:border-white/10 dark:bg-white/5 dark:text-[#dae2fd] dark:shadow-none"
        >
          {TEAM_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white text-foreground dark:bg-[#0b1326] dark:text-[#dae2fd]"
            >
              {t.auth[option.labelKey]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-muted block mb-2 text-start">{t.auth.idDocumentLabel}</label>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-brand/25 bg-white px-4 py-3 text-sm text-foreground transition hover:border-brand/50 dark:border-white/15 dark:bg-white/5">
          <FileUp className="h-4 w-4 shrink-0 text-brand" />
          <span className="truncate text-start text-muted">
            {fileName || t.auth.idDocumentPlaceholder}
          </span>
          <input
            type="file"
            accept="image/*,.pdf,application/pdf"
            className="sr-only"
            onChange={(e) => onChange('lawyerIdDocument', e.target.files?.[0] ?? null)}
          />
        </label>
        <p className="mt-1.5 text-[11px] text-muted text-start">{t.auth.idDocumentHint}</p>
      </div>
    </div>
  );
}
