'use client';

import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';
import {
  formatProfileDateOnly,
  formatProfileTimeOnly,
  formatRelativeTime,
} from '../../lib/profileLabels';
import { PROFILE_ASSETS } from './lib/profileAssets';

type Props = {
  user: AuthUser;
};

function MetaRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-[rgba(79,70,51,0.2)] pb-4 last:border-b-0 last:pb-0">
      {children}
    </div>
  );
}

export default function ProfileActivityCard({ user }: Props) {
  const { t } = useLanguage();

  return (
    <section className="h-full rounded-2xl border border-[rgba(79,70,51,0.3)] bg-[rgba(23,31,51,0.7)] p-[25px] backdrop-blur-[6px]">
      <div className="mb-6 flex items-center justify-end gap-3">
        <h2 className="text-xl font-bold text-[#dae2fd]">{t.dashboard.profileAccount}</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PROFILE_ASSETS.iconAccount}
          alt=""
          className="h-9 w-8"
          width={32}
          height={36}
        />
      </div>

      <div className="space-y-4">
        <MetaRow>
          <p className="text-xs tracking-[0.6px] text-[#d3c5ac]">{t.dashboard.profileEmail}</p>
          <p className="mt-1 break-all text-sm text-[#dae2fd]" dir="ltr">
            {user.email}
          </p>
        </MetaRow>

        <MetaRow>
          <p className="text-xs tracking-[0.6px] text-[#d3c5ac]">{t.dashboard.profileUserId}</p>
          <div className="mt-1.5 inline-flex rounded-sm bg-[rgba(68,226,205,0.05)] px-2 py-0.5">
            <code className="font-mono text-[11px] font-medium text-[#44e2cd]" dir="ltr">
              {user.id}
            </code>
          </div>
        </MetaRow>

        <MetaRow>
          <div className="flex items-start justify-between gap-3">
            <div className="text-start">
              <p className="text-xs tracking-[0.6px] text-[#d3c5ac]">{t.dashboard.profileTime}</p>
              <p className="mt-1 text-sm text-[#dae2fd]">
                {formatProfileTimeOnly(user.createdAt)}
              </p>
            </div>
            <div className="text-end">
              <p className="text-xs tracking-[0.6px] text-[#d3c5ac]">
                {t.dashboard.profileCreatedAt}
              </p>
              <p className="mt-1 text-sm text-[#dae2fd]">
                {formatProfileDateOnly(user.createdAt)}
              </p>
            </div>
          </div>
        </MetaRow>

        <MetaRow>
          <div className="flex items-start justify-between gap-3">
            <div className="text-start">
              <p className="text-xs tracking-[0.6px] text-[#d3c5ac]">{t.dashboard.profileTime}</p>
              <p className="mt-1 text-sm text-[#dae2fd]">
                {formatProfileTimeOnly(user.lastLogin)}
              </p>
            </div>
            <div className="text-end">
              <p className="text-xs tracking-[0.6px] text-[#d3c5ac]">
                {t.dashboard.profileLastLogin}
              </p>
              <p className="mt-1 text-sm text-[#dae2fd]">
                {formatProfileDateOnly(user.lastLogin)}
              </p>
            </div>
          </div>
        </MetaRow>

        <div className="flex items-start justify-between gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PROFILE_ASSETS.iconRefresh}
            alt=""
            className="mt-1 size-3 shrink-0"
            width={12}
            height={12}
          />
          <div className="text-end">
            <p className="text-xs tracking-[0.6px] text-[#d3c5ac]">
              {t.dashboard.profileUpdatedAt}
            </p>
            <p className="mt-1 text-sm text-[#dae2fd]">
              {formatRelativeTime(user.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
