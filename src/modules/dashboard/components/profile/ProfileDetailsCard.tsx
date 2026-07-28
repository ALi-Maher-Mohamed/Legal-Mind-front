'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser, TeamSizeValue } from '@/types/auth.types';
import { teamSizeLabel } from '../../lib/profileLabels';
import type { ProfileEditDraft } from './hooks/useProfileActions';
import { PROFILE_ASSETS } from './lib/profileAssets';
import {
  profileCard,
  profileField,
  profileHeading,
  profileInput,
  profileLabel,
  profileValue,
} from './lib/profileStyles';

const TEAM_OPTIONS: {
  value: TeamSizeValue;
}[] = [
  { value: 'solo' },
  { value: 'small' },
  { value: 'medium' },
  { value: 'large' },
];

export type ProfileDetailsHandle = {
  save: () => Promise<boolean>;
};

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

const ProfileDetailsCard = forwardRef<ProfileDetailsHandle, Props>(
  function ProfileDetailsCard(
    { user, isSaving, editing, onEditingChange, onSave },
    ref,
  ) {
    const { t } = useLanguage();
    const [draft, setDraft] = useState<ProfileEditDraft>(() => toDraft(user));

    useEffect(() => {
      if (!editing) {
        setDraft(toDraft(user));
      }
    }, [user, editing]);

    const canSave =
      draft.fullName.trim().length >= 2 && draft.officeName.trim().length > 0;

    const handleSave = async () => {
      if (!canSave) return false;
      const ok = await onSave(draft);
      if (ok) onEditingChange(false);
      return ok;
    };

    useImperativeHandle(ref, () => ({
      save: handleSave,
    }));

    return (
      <section className={profileCard}>
        <div className="mb-6 flex items-center justify-between gap-3">
          {editing ? (
            <button
              type="button"
              onClick={() => {
                setDraft(toDraft(user));
                onEditingChange(false);
              }}
              disabled={isSaving}
              className="text-sm text-muted transition hover:text-foreground disabled:opacity-60 cursor-pointer dark:text-[#d3c5ac] dark:hover:text-[#dae2fd]"
            >
              {t.dashboard.profileCancelEdit}
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3">
            <h2 className={profileHeading}>{t.dashboard.profileDetails}</h2>
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
            <label className={`${profileField} sm:col-span-2`}>
              <span className={profileLabel}>{t.dashboard.profileFullName}</span>
              <input
                type="text"
                value={draft.fullName}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className={profileInput}
                minLength={2}
                maxLength={100}
              />
            </label>
            <label className={`${profileField} sm:col-span-2`}>
              <span className={profileLabel}>{t.dashboard.profileOffice}</span>
              <input
                type="text"
                value={draft.officeName}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, officeName: e.target.value }))
                }
                className={profileInput}
                maxLength={200}
              />
            </label>
            <label className={profileField}>
              <span className={profileLabel}>{t.dashboard.profilePhone}</span>
              <input
                type="tel"
                value={draft.phone}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={profileInput}
                dir="ltr"
              />
            </label>
            <label className={profileField}>
              <span className={profileLabel}>{t.dashboard.profileBarId}</span>
              <input
                type="text"
                value={draft.barAssociationNumber}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    barAssociationNumber: e.target.value,
                  }))
                }
                className={profileInput}
                dir="ltr"
              />
            </label>
            <label className={`${profileField} sm:col-span-2`}>
              <span className={profileLabel}>{t.dashboard.profileTeamSize}</span>
              <select
                value={draft.teamSize}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    teamSize: e.target.value as TeamSizeValue,
                  }))
                }
                className={profileInput}
              >
                {TEAM_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-white text-foreground dark:bg-[#0b1326] dark:text-[#dae2fd]"
                  >
                    {teamSizeLabel(option.value)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={profileField}>
              <p className={profileLabel}>{t.dashboard.profilePhone}</p>
              <p className={`${profileValue} tracking-[0.8px]`} dir="ltr">
                {user.phone || '—'}
              </p>
            </div>
            <div className={profileField}>
              <p className={profileLabel}>{t.dashboard.profileBarId}</p>
              <p className={profileValue}>{user.barId || '—'}</p>
            </div>
            <div
              className={`${profileField} flex items-center justify-between gap-4 sm:col-span-2`}
            >
              <div className="min-w-0 text-end">
                <p className={profileLabel}>{t.dashboard.profileTeamSize}</p>
                <p className="mt-1 text-base font-bold text-foreground dark:text-[#dae2fd]">
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
  },
);

export default ProfileDetailsCard;
