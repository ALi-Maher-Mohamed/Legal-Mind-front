'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BadgeCheck,
  Briefcase,
  CalendarClock,
  FileText,
  IdCard,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import { authService } from '@/services/auth.service';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { resolveMediaUrl } from '@/lib/api/media';
import type { AuthUser } from '@/types/auth.types';
import { dashPanel } from '../../lib/panelStyles';
import { formatProfileDate, roleLabel, teamSizeLabel } from '../../lib/profileLabels';
import ConfirmModal from '../ui/ConfirmModal';
import ProfileField from './ProfileField';

type Props = {
  user: AuthUser;
  onUserUpdate: (user: AuthUser) => void;
};

export default function ProfileView({ user, onUserUpdate }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [docFailed, setDocFailed] = useState(false);

  const documentUrl = resolveMediaUrl(user.lawyerIdDocument);
  const initials = (user.displayName || user.name || 'م')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  useEffect(() => {
    setDocFailed(false);
  }, [user.lawyerIdDocument]);

  const refreshProfile = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await authService.me();
      onUserUpdate(fresh);
      toastApiSuccess(t.dashboard.profileRefreshed);
    } catch (error) {
      toastApiError(error, t.dashboard.profileRefreshError);
    } finally {
      setIsRefreshing(false);
    }
  };

  const logoutAllDevices = async () => {
    setIsLoggingOutAll(true);
    try {
      const result = await authService.logoutAll();
      toastApiSuccess(result.message || t.dashboard.profileLogoutAllTitle);
      router.replace(ROUTES.login);
    } catch (error) {
      toastApiError(error, t.dashboard.profileLogoutAllError);
      setIsLoggingOutAll(false);
      setLogoutAllOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <section
        className={`relative overflow-hidden ${dashPanel}`}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-[#0b1326] via-[#132347] to-[#0038b6]" />
        <div className="absolute -start-16 top-0 h-56 w-56 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute -end-10 bottom-0 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-accent" />

        <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl font-bold text-white shadow-lg backdrop-blur-sm">
              {initials || <UserRound className="h-8 w-8" />}
            </div>
            <div className="min-w-0 text-start">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {t.dashboard.profileBadge}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {user.displayName || user.name}
              </h1>
              <p className="mt-1 text-sm text-[#c4c6cf]">{user.firmName || t.dashboard.workspace}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
                  <Scale className="h-3.5 w-3.5 text-accent" />
                  {roleLabel(user.role)}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                    user.isEmailVerified
                      ? 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200'
                      : 'border-amber-300/30 bg-amber-300/15 text-amber-100'
                  }`}
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {user.isEmailVerified
                    ? t.dashboard.profileEmailVerified
                    : t.dashboard.profileEmailUnverified}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                    user.isActive
                      ? 'border-sky-300/30 bg-sky-300/15 text-sky-100'
                      : 'border-rose-300/30 bg-rose-300/15 text-rose-100'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {user.isActive ? t.dashboard.profileActive : t.dashboard.profileInactive}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refreshProfile()}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-60 cursor-pointer md:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t.dashboard.profileRefresh}
          </button>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <div className={`${dashPanel} p-5 sm:p-6`}>
          <div className="mb-5 flex items-center gap-2 border-b border-brand/10 pb-4 dark:border-white/10">
            <IdCard className="h-4 w-4 text-brand" />
            <h2 className="text-base font-bold text-foreground">{t.dashboard.profileDetails}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ProfileField label={t.dashboard.profileFullName} value={user.name} />
            <ProfileField label={t.dashboard.profileEmail} value={user.email} dir="ltr" />
            <ProfileField label={t.dashboard.profilePhone} value={user.phone || '—'} dir="ltr" />
            <ProfileField label={t.dashboard.profileOffice} value={user.firmName} />
            <ProfileField label={t.dashboard.profileBarId} value={user.barId || '—'} dir="ltr" />
            <ProfileField
              label={t.dashboard.profileTeamSize}
              value={teamSizeLabel(user.teamSize)}
            />
            <ProfileField label={t.dashboard.profileRole} value={roleLabel(user.role)} />
            <ProfileField label={t.dashboard.profileUserId} value={user.id} dir="ltr" />
          </div>
        </div>

        <div className="space-y-5">
          <div className={`${dashPanel} p-5 sm:p-6`}>
            <div className="mb-5 flex items-center gap-2 border-b border-brand/10 pb-4 dark:border-white/10">
              <CalendarClock className="h-4 w-4 text-accent" />
              <h2 className="text-base font-bold text-foreground">{t.dashboard.profileActivity}</h2>
            </div>
            <div className="space-y-3">
              <ProfileField
                label={t.dashboard.profileLastLogin}
                value={formatProfileDate(user.lastLogin)}
              />
              <ProfileField
                label={t.dashboard.profileCreatedAt}
                value={formatProfileDate(user.createdAt)}
              />
              <ProfileField
                label={t.dashboard.profileUpdatedAt}
                value={formatProfileDate(user.updatedAt)}
              />
            </div>
          </div>

          <div className={`${dashPanel} overflow-hidden`}>
            <div className="flex items-center gap-2 border-b border-brand/10 px-5 py-4 sm:px-6 dark:border-white/10">
              <FileText className="h-4 w-4 text-brand" />
              <h2 className="text-base font-bold text-foreground">{t.dashboard.profileIdDocument}</h2>
            </div>
            <div className="p-5 sm:p-6">
              {documentUrl && !docFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={documentUrl}
                  alt={t.dashboard.profileIdDocument}
                  className="h-52 w-full rounded-xl border border-brand/10 object-cover dark:border-white/10"
                  onError={() => setDocFailed(true)}
                />
              ) : (
                <div className="flex h-52 flex-col items-center justify-center rounded-xl border border-dashed border-brand/20 bg-[#f0f4ff] text-center dark:border-white/10 dark:bg-white/5">
                  <Briefcase className="mb-2 h-6 w-6 text-brand" />
                  <p className="text-sm text-muted">{t.dashboard.profileNoDocument}</p>
                </div>
              )}
              {user.lawyerIdDocument ? (
                <p className="mt-3 break-all text-[11px] text-muted" dir="ltr">
                  {user.lawyerIdDocument}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className={`${dashPanel} p-5 sm:p-6`}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#f0f4ff] px-4 py-3 dark:bg-white/5">
            <Mail className="h-4 w-4 text-brand" />
            <div className="min-w-0 text-start">
              <p className="text-[11px] text-muted">{t.dashboard.profileEmail}</p>
              <p className="truncate text-sm font-medium text-foreground" dir="ltr">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#f0f4ff] px-4 py-3 dark:bg-white/5">
            <Phone className="h-4 w-4 text-brand" />
            <div className="min-w-0 text-start">
              <p className="text-[11px] text-muted">{t.dashboard.profilePhone}</p>
              <p className="truncate text-sm font-medium text-foreground" dir="ltr">
                {user.phone || '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-[#f0f4ff] px-4 py-3 dark:bg-white/5">
            <Briefcase className="h-4 w-4 text-brand" />
            <div className="min-w-0 text-start">
              <p className="text-[11px] text-muted">{t.dashboard.profileOffice}</p>
              <p className="truncate text-sm font-medium text-foreground">{user.firmName || '—'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${dashPanel} overflow-hidden`}>
        <div className="flex items-center gap-2 border-b border-brand/10 px-5 py-4 sm:px-6 dark:border-white/10">
          <ShieldAlert className="h-4 w-4 text-danger" />
          <h2 className="text-base font-bold text-foreground">{t.dashboard.profileSecurity}</h2>
        </div>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
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
            onClick={() => setLogoutAllOpen(true)}
            disabled={isLoggingOutAll}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-danger/25 bg-danger/10 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/15 disabled:opacity-60 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {t.dashboard.profileLogoutAllBtn}
          </button>
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
        onCancel={() => {
          if (!isLoggingOutAll) setLogoutAllOpen(false);
        }}
        onConfirm={() => void logoutAllDevices()}
      />
    </div>
  );
}
