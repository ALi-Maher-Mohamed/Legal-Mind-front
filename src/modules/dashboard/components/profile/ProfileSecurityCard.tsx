'use client';

import { LogOut, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import ConfirmModal from '../ui/ConfirmModal';
import ProfileSection from './ProfileSection';

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
      <ProfileSection
        title={t.dashboard.profileSecurity}
        icon={ShieldAlert}
        iconClassName="text-danger"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 text-start">
            <p className="text-sm font-semibold text-foreground">
              {t.dashboard.profileLogoutAllTitle}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              {t.dashboard.profileLogoutAllDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenLogoutAll}
            disabled={isLoggingOutAll}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-danger/25 bg-danger/10 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/15 disabled:opacity-60 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {t.dashboard.profileLogoutAllBtn}
          </button>
        </div>
      </ProfileSection>

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
