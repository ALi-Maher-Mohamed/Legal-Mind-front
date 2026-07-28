'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser, TeamSizeValue } from '@/types/auth.types';
import { teamSizeLabel } from '../../lib/profileLabels';
import type { ProfileEditDraft } from './hooks/useProfileActions';
import { PROFILE_ASSETS } from './lib/profileAssets';

const TEAM_OPTIONS: {
  value: TeamSizeValue;
  labelKey: 'teamSolo' | 'teamSmall' | 'teamMedium' | 'teamLarge';
}[] = [
  { value: 'solo', labelKey: 'teamSolo' },
  { value: 'small', labelKey: 'teamSmall' },
  { value: 'medium', labelKey: 'teamMedium' },
  { value: 'large', labelKey: 'teamLarge' },
];

type Props = {
  user: AuthUser;
  isSaving: boolean;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  onSave: (draft: ProfileEditDraft) => Promise<boolean>;
};

function toDraft(user: AuthUser): ProfileEditDraft {
  const teamSize = TEAM_OPTIONS.some((option) => option.value === user.teamSize)
    ? (user.teamSize as TeamSizeValue)
    : 'small';

  return {
    fullName: user.displayName || user.name || '',
    officeName: user.firmName || '',
    barAssociationNumber: user.barId || '',
    phone: user.phone || '',
    teamSize,
  };
}

const fieldClass =
  'rounded-lg border border-[rgba(79,70,51,0.2)] bg-[#060e20] p-[17px]';
const labelClass = 'text-xs tracking-[0.6px] text-[#d3c5ac]';
const valueClass = 'mt-1 text-base font-semibold text-[#dae2fd]';
const inputClass =
  'mt-1.5 w-full rounded-md border border-[rgba(79,70,51,0.35)] bg-[#0b1326] px-3 py-2 text-sm text-[#dae2fd] outline-none transition focus:border-[#44e2cd]';

export default function ProfileDetailsCard({
  user,
  isSaving,
  editing,
  onEditingChange,
  onSave,
}: Props) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState<ProfileEditDraft>(() => toDraft(user));

  useEffect(() => {
    if (!editing) setDraft(toDraft(user));
  }, [user, editing]);

  const handleSave = async () => {
    const ok = await onSave(draft);
    if (ok) onEditingChange(false);
  };

  const canSave =
    draft.fullName.trim().length >= 2 && draft.officeName.trim().length > 0;

  return (
    <section className="rounded-2xl border border-[rgba(79,70,51,0.3)] bg-[rgba(23,31,51,0.7)] p-[25px] backdrop-blur-[6px]">
      <div className="mb-6 flex items-center justify-between gap-3">
        {editing ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDraft(toDraft(user));
                onEditingChange(false);
              }}
              disabled={isSaving}
              className="text-sm text-[#d3c5ac] transition hover:text-[#dae2fd] disabled:opacity-60 cursor-pointer"
            >
              {t.dashboard.profileCancelEdit}
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving || !canSave}
              className="rounded-md bg-[#44e2cd]/15 px-3 py-1.5 text-sm font-semibold text-[#44e2cd] transition hover:bg-[#44e2cd]/25 disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? t.dashboard.profileSaving : t.dashboard.profileSave}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onEditingChange(true)}
            className="text-base text-[#44e2cd] transition hover:brightness-110 cursor-pointer"
          >
            {t.dashboard.profileEdit}
          </button>
        )}

        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#dae2fd]">{t.dashboard.profileDetails}</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PROFILE_ASSETS.iconDetails}
            alt=""
            className="h-9 w-[34px]"
            width={34}
            height={36}
          />
        </div>
      </div>

      {editing ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={`${fieldClass} sm:col-span-2`}>
            <span className={labelClass}>{t.dashboard.profileFullName}</span>
            <input
              type="text"
              value={draft.fullName}
              onChange={(e) => setDraft((prev) => ({ ...prev, fullName: e.target.value }))}
              className={inputClass}
              minLength={2}
              maxLength={100}
            />
          </label>
          <label className={`${fieldClass} sm:col-span-2`}>
            <span className={labelClass}>{t.dashboard.profileOffice}</span>
            <input
              type="text"
              value={draft.officeName}
              onChange={(e) => setDraft((prev) => ({ ...prev, officeName: e.target.value }))}
              className={inputClass}
              maxLength={200}
            />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>{t.dashboard.profilePhone}</span>
            <input
              type="tel"
              value={draft.phone}
              onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
              className={inputClass}
              dir="ltr"
            />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>{t.dashboard.profileBarId}</span>
            <input
              type="text"
              value={draft.barAssociationNumber}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  barAssociationNumber: e.target.value,
                }))
              }
              className={inputClass}
              dir="ltr"
            />
          </label>
          <label className={`${fieldClass} sm:col-span-2`}>
            <span className={labelClass}>{t.dashboard.profileTeamSize}</span>
            <select
              value={draft.teamSize}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  teamSize: e.target.value as TeamSizeValue,
                }))
              }
              className={inputClass}
            >
              {TEAM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#0b1326]">
                  {teamSizeLabel(option.value)}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={fieldClass}>
            <p className={labelClass}>{t.dashboard.profilePhone}</p>
            <p className={`${valueClass} tracking-[0.8px]`} dir="ltr">
              {user.phone || '—'}
            </p>
          </div>
          <div className={fieldClass}>
            <p className={labelClass}>{t.dashboard.profileBarId}</p>
            <p className={valueClass}>{user.barId || '—'}</p>
          </div>
          <div className={`${fieldClass} flex items-center justify-between gap-4 sm:col-span-2`}>
            <div className="min-w-0 text-end">
              <p className={labelClass}>{t.dashboard.profileTeamSize}</p>
              <p className="mt-1 text-base font-bold text-[#dae2fd]">
                {teamSizeLabel(user.teamSize)}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFILE_ASSETS.iconTeam}
              alt=""
              className="h-3 w-6 shrink-0 opacity-80"
              width={24}
              height={12}
            />
          </div>
        </div>
      )}
    </section>
  );
}
