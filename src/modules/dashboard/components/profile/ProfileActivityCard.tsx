"use client";

import { useLanguage } from "@/hooks/useLanguage";
import type { AuthUser } from "@/types/auth.types";
import {
  formatProfileDateOnly,
  formatProfileTimeOnly,
  formatRelativeTime,
} from "../../lib/profileLabels";
import { PROFILE_ASSETS } from "./lib/profileAssets";
import {
  profileCard,
  profileDivider,
  profileHeading,
  profileLabel,
} from "./lib/profileStyles";

type Props = {
  user: AuthUser;
};

function MetaRow({ children }: { children: React.ReactNode }) {
  return <div className={profileDivider}>{children}</div>;
}

export default function ProfileActivityCard({ user }: Props) {
  const { t } = useLanguage();

  return (
    <section className={`h-full ${profileCard}`}>
      <div className="mb-6 flex items-center justify-end gap-3">
        <h2 className={profileHeading}>{t.dashboard.profileAccount}</h2>
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
          <p className={profileLabel}>{t.dashboard.profileEmail}</p>
          <p
            className="mt-1 break-all text-sm text-foreground dark:text-[#e6edfc]"
            dir="ltr"
          >
            {user.email}
          </p>
        </MetaRow>

        <MetaRow>
          <div className="flex items-start justify-between gap-3">
            <div className="text-start">
              <p className={profileLabel}>{t.dashboard.profileTime}</p>
              <p className="mt-1 text-sm text-foreground dark:text-[#e6edfc]">
                {formatProfileTimeOnly(user.createdAt)}
              </p>
            </div>
            <div className="text-end">
              <p className={profileLabel}>{t.dashboard.profileCreatedAt}</p>
              <p className="mt-1 text-sm text-foreground dark:text-[#e6edfc]">
                {formatProfileDateOnly(user.createdAt)}
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
            <p className={profileLabel}>{t.dashboard.profileUpdatedAt}</p>
            <p className="mt-1 text-sm text-foreground dark:text-[#e6edfc]">
              {formatRelativeTime(user.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
