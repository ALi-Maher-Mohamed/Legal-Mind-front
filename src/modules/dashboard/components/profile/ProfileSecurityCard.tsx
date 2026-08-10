'use client';

import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import ConfirmModal from '../ui/ConfirmModal';
import { PROFILE_ASSETS } from './lib/profileAssets';

type Props = {
  logoutAllOpen: boolean;
  isLoggingOutAll: boolean;
  onOpenLogoutAll: () => void;
  onCloseLogoutAll: () => void;
  onConfirmLogoutAll: () => void;
};

export default function ProfileSecurityCard({
  logoutAllOpen,
  isLoggingOutAll,
  onOpenLogoutAll,
  onCloseLogoutAll,
  onConfirmLogoutAll,
}: Props) {
  const { t } = useLanguage();

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-danger/20 bg-danger/[0.04] p-[25px] shadow-[0_2px_8px_rgba(0,62,199,0.04)] dark:border-[rgba(248,113,113,0.25)] dark:bg-[rgba(248,113,113,0.06)] dark:shadow-none dark:backdrop-blur-[6px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PROFILE_ASSETS.iconSecurityBg}
          alt=""
          className="pointer-events-none absolute -bottom-12 -end-12 size-[167px] opacity-5"
          width={167}
          height={167}
        />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onOpenLogoutAll}
            disabled={isLoggingOutAll}
            className="order-2 inline-flex shrink-0 items-center justify-center gap-3 rounded-lg border-2 border-danger px-[34px] py-3.5 text-base font-bold text-danger transition hover:bg-danger/5 disabled:opacity-60 cursor-pointer sm:order-1 dark:border-[#f87171] dark:text-[#f87171] dark:hover:bg-[rgba(248,113,113,0.08)]"
          >
            <span>{t.dashboard.profileLogoutAllBtn}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFILE_ASSETS.iconLogout}
              alt=""
              className="size-[18px]"
              width={18}
              height={18}
            />
          </button>

          <div className="order-1 flex items-center gap-4 sm:order-2">
            <div className="min-w-0 text-start sm:text-end">
              <h2 className="text-xl font-bold text-foreground dark:text-[#e6edfc]">
                {t.dashboard.profileSecurity}
              </h2>
              <p className="mt-1 text-sm leading-5 text-muted dark:text-[#9dabc9]">
                {t.dashboard.profileLogoutAllDesc}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFILE_ASSETS.iconSecurity}
              alt=""
              className="h-[51px] w-[45px] shrink-0"
              width={45}
              height={51}
            />
          </div>
        </div>
      </section>

      <ConfirmModal
        open={logoutAllOpen}
        title={t.dashboard.profileLogoutAllTitle}
        description={t.dashboard.profileLogoutAllConfirm}
        confirmLabel={t.dashboard.profileLogoutAllBtn}
        cancelLabel={t.dashboard.cancel}
        isLoading={isLoggingOutAll}
        tone="danger"
        icon={ShieldAlert}
        onCancel={onCloseLogoutAll}
        onConfirm={onConfirmLogoutAll}
      />
    </>
  );
}
