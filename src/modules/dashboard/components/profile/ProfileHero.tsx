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
  isUploadingAvatar: boolean;
  onEditProfile: () => void;
  onAvatarSelected: (file: File) => void;
};

export default function ProfileHero({
  user,
  isUploadingAvatar,
  onEditProfile,
  onAvatarSelected,
}: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const canPreview = Boolean(user.avatarUrl);

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-[rgba(155,143,121,0.15)] bg-[#0b1326] shadow-[0_0_20px_rgba(234,179,8,0.05)] backdrop-blur-[6px]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(234,179,8,0.1), transparent 50%), radial-gradient(circle at 80% 80%, rgba(68,226,205,0.05), transparent 50%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-8 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => canPreview && setPreviewOpen(true)}
              disabled={!canPreview}
              className={`relative size-32 overflow-hidden rounded-2xl border-2 border-[#ffd165] p-0.5 shadow-[0_20px_25px_-5px_rgba(255,209,101,0.2)] ${
                canPreview ? 'cursor-pointer' : 'cursor-default'
              }`}
              aria-label={canPreview ? t.dashboard.profilePreviewCta : undefined}
            >
              <UserAvatar
                user={user}
                className="size-full bg-[#132347]"
                textClassName="text-3xl text-[#ffd165]"
                roundedClassName="rounded-[14px]"
              />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-2 -start-2 flex size-9 items-center justify-center rounded-xl border border-[#4f4633] bg-[#31394d] shadow-lg transition hover:bg-[#3a435a] disabled:opacity-60 cursor-pointer"
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
            <p className="text-xs tracking-[0.6px] text-[#ffd165]">
              {t.dashboard.profileBadge}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#dae2fd] sm:text-[32px] sm:leading-10">
              {user.displayName || user.name}
            </h1>
            <p className="mt-1 text-base text-[#d3c5ac]">
              {user.firmName || t.dashboard.workspace}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <span
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[11px] ${
                  user.isActive
                    ? 'border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] text-[#4ade80]'
                    : 'border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.1)] text-[#ffb4ab]'
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
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(255,209,101,0.3)] bg-[rgba(255,209,101,0.1)] px-3 py-1 text-[11px] text-[#ffd165]">
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
                    ? 'border-[rgba(68,226,205,0.3)] bg-[rgba(68,226,205,0.1)] text-[#44e2cd]'
                    : 'border-[rgba(255,209,101,0.3)] bg-[rgba(255,209,101,0.1)] text-[#ffd165]'
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
            onClick={onEditProfile}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-[#ffd165] px-6 py-2.5 text-base font-bold text-[#604700] shadow-[0_10px_15px_-3px_rgba(255,209,101,0.2)] transition hover:brightness-105 cursor-pointer"
          >
            <span>{t.dashboard.profileEditProfile}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFILE_ASSETS.iconEdit}
              alt=""
              className="size-[18px]"
              width={18}
              height={18}
            />
          </button>
        </div>
      </section>

      {user.avatarUrl ? (
        <ProfileImagePreview
          open={previewOpen}
          src={user.avatarUrl}
          alt={user.displayName || user.name}
          title={t.dashboard.profileAvatarPreviewTitle}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </>
  );
}
