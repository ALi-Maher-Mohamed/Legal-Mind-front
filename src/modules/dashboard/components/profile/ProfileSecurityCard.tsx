'use client';

import { useLanguage } from '@/hooks/useLanguage';
import ConfirmModal from '../ui/ConfirmModal';
import { PROFILE_ASSETS } from './lib/profileAssets';
import { ShieldAlert } from 'lucide-react';

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
      <section className="relative overflow-hidden rounded-2xl border border-[rgba(255,180,171,0.2)] bg-[rgba(255,180,171,0.05)] p-[25px] backdrop-blur-[6px]">
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
            className="inline-flex shrink-0 items-center justify-center gap-3 rounded-lg border-2 border-[#ffb4ab] px-[34px] py-3.5 text-base font-bold text-[#ffb4ab] transition hover:bg-[rgba(255,180,171,0.08)] disabled:opacity-60 cursor-pointer order-2 sm:order-1"
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

          <div className="flex items-center gap-4 order-1 sm:order-2">
            <div className="min-w-0 text-start sm:text-end">
              <h2 className="text-xl font-bold text-[#dae2fd]">
                {t.dashboard.profileSecurity}
              </h2>
              <p className="mt-1 text-sm leading-5 text-[#d3c5ac]">
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
