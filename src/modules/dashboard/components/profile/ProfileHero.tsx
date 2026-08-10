'use client';

import { useRef, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';
import { roleLabel } from '../../lib/profileLabels';
import { AVATAR_ACCEPT } from './lib/avatarUpload';
import { PROFILE_ASSETS } from './lib/profileAssets';
import ProfileImagePreview from './ProfileImagePreview';
import UserAvatar from './UserAvatar';

type Props = {
  user: AuthUser;
  editing: boolean;
  isSaving: boolean;
  isUploadingAvatar: boolean;
  onEditProfile: () => void;
  onSaveProfile: () => void;
  onAvatarSelected: (file: File) => void;
};

export default function ProfileHero({
  user,
  editing,
  isSaving,
  isUploadingAvatar,
  onEditProfile,
  onSaveProfile,
  onAvatarSelected,
}: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const canPreview = Boolean(user.avatarUrl);

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-l from-[#0038b6] via-brand to-[#0052e0] shadow-[0_2px_12px_rgba(0,62,199,0.12)] dark:border-white/10 dark:bg-[#101a30] dark:from-[#0d1528] dark:via-[#101a30] dark:to-[#16223c] dark:shadow-none dark:backdrop-blur-[6px]">
        <div
          className="pointer-events-none absolute inset-0 hidden dark:block"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(242,193,78,0.08), transparent 50%), radial-gradient(circle at 80% 80%, rgba(77,126,247,0.08), transparent 50%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,209,101,0.18),transparent_45%)] dark:hidden" />

        <div className="relative z-10 flex flex-col items-center gap-8 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => canPreview && setPreviewOpen(true)}
              disabled={!canPreview}
              className={`relative size-32 overflow-hidden rounded-2xl border-2 border-accent p-0.5 shadow-[0_12px_24px_-6px_rgba(255,209,101,0.35)] dark:border-[#f2c14e] dark:shadow-[0_20px_25px_-5px_rgba(242,193,78,0.15)] ${
                canPreview ? 'cursor-pointer' : 'cursor-default'
              }`}
              aria-label={canPreview ? t.dashboard.profilePreviewCta : undefined}
            >
              <UserAvatar
                user={user}
                className="size-full bg-white/15 dark:bg-[#16223c]"
                textClassName="text-3xl text-accent dark:text-[#f2c14e]"
                roundedClassName="rounded-[14px]"
              />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-2 -start-2 flex size-9 items-center justify-center rounded-xl border border-white/30 bg-brand shadow-lg transition hover:brightness-110 disabled:opacity-60 cursor-pointer dark:border-white/15 dark:bg-[#4d7ef7] dark:hover:brightness-110"
              aria-label={t.dashboard.profileAvatarChange}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PROFILE_ASSETS.iconCamera}
                alt=""
                className="size-[17px]"
                width={17}
                height={15}
              />
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={AVATAR_ACCEPT}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (file) onAvatarSelected(file);
              }}
            />
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-start">
            <p className="text-xs tracking-[0.6px] text-accent dark:text-[#f2c14e]">
              {t.dashboard.profileBadge}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-[32px] sm:leading-10 dark:text-[#e6edfc]">
              {user.name}
            </h1>
            <p className="mt-1 text-base text-white/75 dark:text-[#9dabc9]">
              {user.firmName || t.dashboard.workspace}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[11px] ${
                  user.isActive
                    ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100 dark:border-[rgba(52,211,153,0.3)] dark:bg-[rgba(52,211,153,0.1)] dark:text-[#34d399]'
                    : 'border-rose-300/40 bg-rose-400/15 text-rose-100 dark:border-[rgba(248,113,113,0.3)] dark:bg-[rgba(248,113,113,0.1)] dark:text-[#f87171]'
                }`}
              >
                {user.isActive ? t.dashboard.profileActive : t.dashboard.profileInactive}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PROFILE_ASSETS.iconCheck}
                  alt=""
                  className="size-[12px]"
                  width={12}
                  height={12}
                />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/15 px-3 py-1 text-[11px] text-accent dark:border-[rgba(242,193,78,0.3)] dark:bg-[rgba(242,193,78,0.1)] dark:text-[#f2c14e]">
                {roleLabel(user.role)}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PROFILE_ASSETS.iconLawyer}
                  alt=""
                  className="size-[12px]"
                  width={12}
                  height={12}
                />
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[11px] ${
                  user.isEmailVerified
                    ? 'border-sky-300/40 bg-sky-400/15 text-sky-100 dark:border-[rgba(123,161,249,0.3)] dark:bg-[rgba(77,126,247,0.12)] dark:text-[#7ba1f9]'
                    : 'border-accent/40 bg-accent/15 text-accent dark:border-[rgba(242,193,78,0.3)] dark:bg-[rgba(242,193,78,0.1)] dark:text-[#f2c14e]'
                }`}
              >
                {user.isEmailVerified
                  ? t.dashboard.profileEmailVerified
                  : t.dashboard.profileEmailUnverified}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PROFILE_ASSETS.iconMail}
                  alt=""
                  className="h-[12px] w-[13px]"
                  width={13}
                  height={12}
                />
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={editing ? onSaveProfile : onEditProfile}
            disabled={editing && isSaving}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-accent px-6 py-2.5 text-base font-bold text-[#604700] shadow-[0_10px_15px_-3px_rgba(255,209,101,0.25)] transition hover:brightness-105 disabled:opacity-60 cursor-pointer dark:bg-[#4d7ef7] dark:text-[#f4f7ff] dark:shadow-[0_10px_15px_-3px_rgba(77,126,247,0.25)]"
          >
            <span>
              {editing
                ? isSaving
                  ? t.dashboard.profileSaving
                  : t.dashboard.profileSaveAction
                : t.dashboard.profileEditProfile}
            </span>
            {!editing ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={PROFILE_ASSETS.iconEdit}
                alt=""
                className="size-[18px]"
                width={18}
                height={18}
              />
            ) : null}
          </button>
        </div>
      </section>

      {user.avatarUrl ? (
        <ProfileImagePreview
          open={previewOpen}
          src={user.avatarUrl}
          alt={user.name}
          title={t.dashboard.profileAvatarPreviewTitle}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </>
  );
}
