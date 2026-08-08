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
      <section className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-l from-[#0038b6] via-brand to-[#0052e0] shadow-[0_2px_12px_rgba(0,62,199,0.12)] dark:border-[rgba(155,143,121,0.15)] dark:bg-[#0b1326] dark:from-[#0b1326] dark:via-[#0b1326] dark:to-[#0b1326] dark:shadow-[0_0_20px_rgba(234,179,8,0.05)] dark:backdrop-blur-[6px]">
        <div
          className="pointer-events-none absolute inset-0 hidden dark:block"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(234,179,8,0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(68,226,205,0.05), transparent 50%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,209,101,0.18),transparent_45%)] dark:hidden" />

        <div className="relative z-10 flex flex-col items-center gap-8 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => canPreview && setPreviewOpen(true)}
              disabled={!canPreview}
              className={`relative size-32 overflow-hidden rounded-2xl border-2 border-accent p-0.5 shadow-[0_12px_24px_-6px_rgba(255,209,101,0.35)] dark:border-[#ffd165] dark:shadow-[0_20px_25px_-5px_rgba(255,209,101,0.2)] ${
                canPreview ? 'cursor-pointer' : 'cursor-default'
              }`}
              aria-label={canPreview ? t.dashboard.profilePreviewCta : undefined}
            >
              <UserAvatar
                user={user}
                className="size-full bg-white/15 dark:bg-[#132347]"
                textClassName="text-3xl text-accent dark:text-[#ffd165]"
                roundedClassName="rounded-[14px]"
              />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-2 -start-2 flex size-9 items-center justify-center rounded-xl border border-white/30 bg-brand shadow-lg transition hover:brightness-110 disabled:opacity-60 cursor-pointer dark:border-[#4f4633] dark:bg-[#31394d] dark:hover:bg-[#3a435a] dark:hover:brightness-100"
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
            <p className="text-xs tracking-[0.6px] text-accent dark:text-[#ffd165]">
              {t.dashboard.profileBadge}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-[32px] sm:leading-10 dark:text-[#dae2fd]">
              {user.name}
            </h1>
            <p className="mt-1 text-base text-white/75 dark:text-[#d3c5ac]">
              {user.firmName || t.dashboard.workspace}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[11px] ${
                  user.isActive
                    ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100 dark:border-[rgba(34,197,94,0.3)] dark:bg-[rgba(34,197,94,0.1)] dark:text-[#4ade80]'
                    : 'border-rose-300/40 bg-rose-400/15 text-rose-100 dark:border-[rgba(255,180,171,0.3)] dark:bg-[rgba(255,180,171,0.1)] dark:text-[#ffb4ab]'
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
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/15 px-3 py-1 text-[11px] text-accent dark:border-[rgba(255,209,101,0.3)] dark:bg-[rgba(255,209,101,0.1)] dark:text-[#ffd165]">
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
                    ? 'border-sky-300/40 bg-sky-400/15 text-sky-100 dark:border-[rgba(68,226,205,0.3)] dark:bg-[rgba(68,226,205,0.1)] dark:text-[#44e2cd]'
                    : 'border-accent/40 bg-accent/15 text-accent dark:border-[rgba(255,209,101,0.3)] dark:bg-[rgba(255,209,101,0.1)] dark:text-[#ffd165]'
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
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-accent px-6 py-2.5 text-base font-bold text-[#604700] shadow-[0_10px_15px_-3px_rgba(255,209,101,0.25)] transition hover:brightness-105 disabled:opacity-60 cursor-pointer dark:bg-[#ffd165] dark:shadow-[0_10px_15px_-3px_rgba(255,209,101,0.2)]"
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
