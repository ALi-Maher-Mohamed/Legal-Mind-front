'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { resolveMediaUrl } from '@/lib/api/media';
import type { AuthUser } from '@/types/auth.types';
import { PROFILE_ASSETS } from './lib/profileAssets';
import { profileCard, profileHeading, profileMuted } from './lib/profileStyles';
import ProfileImagePreview from './ProfileImagePreview';

type Props = {
  user: AuthUser;
};

export default function ProfileDocumentCard({ user }: Props) {
  const { t } = useLanguage();
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const documentUrl = resolveMediaUrl(user.lawyerIdDocument);
  const docFailed = failedPath === (user.lawyerIdDocument || null);
  const canPreview = Boolean(documentUrl && !docFailed);

  return (
    <>
      <section className={profileCard}>
        <div className="mb-6 flex items-center justify-end gap-3">
          <h2 className={profileHeading}>{t.dashboard.profileIdDocument}</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PROFILE_ASSETS.iconDocument}
            alt=""
            className="h-8 w-9"
            width={36}
            height={32}
          />
        </div>

        {canPreview && documentUrl ? (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="group relative flex min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-brand/25 bg-[#e8eefc] cursor-pointer dark:border-[rgba(79,70,51,0.5)] dark:bg-[#2d3449]"
            aria-label={t.dashboard.profilePreviewIdDoc}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={documentUrl}
              alt={t.dashboard.profileIdDocument}
              className="absolute inset-0 size-full object-cover opacity-60 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-70"
              onError={() => setFailedPath(user.lawyerIdDocument || null)}
            />
            <div className="relative z-10 flex flex-col items-center gap-3 rounded-2xl border border-brand/15 bg-white/90 px-6 py-6 shadow-sm backdrop-blur-[6px] dark:border-white/10 dark:bg-[rgba(11,19,38,0.8)] dark:shadow-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PROFILE_ASSETS.iconEye}
                alt=""
                className="h-[30px] w-11"
                width={44}
                height={30}
              />
              <span className="text-base font-bold text-foreground dark:text-[#dae2fd]">
                {t.dashboard.profilePreviewIdDoc}
              </span>
            </div>
          </button>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/25 bg-[#e8eefc] text-center dark:border-[rgba(79,70,51,0.5)] dark:bg-[#2d3449]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFILE_ASSETS.iconDocument}
              alt=""
              className="mb-3 h-8 w-9 opacity-70"
              width={36}
              height={32}
            />
            <p className={profileMuted}>{t.dashboard.profileNoDocument}</p>
          </div>
        )}
      </section>

      {documentUrl ? (
        <ProfileImagePreview
          open={previewOpen}
          src={documentUrl}
          alt={t.dashboard.profileIdDocument}
          title={t.dashboard.profilePreviewTitle}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </>
  );
}
