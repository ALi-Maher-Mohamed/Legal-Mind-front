'use client';

import { BadgeCheck, RefreshCw, Scale, ShieldCheck, UserRound } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';
import { dashPanel } from '../../lib/panelStyles';
import { roleLabel } from '../../lib/profileLabels';
import { getInitials } from './lib/getInitials';

type Props = {
  user: AuthUser;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export default function ProfileHero({ user, isRefreshing, onRefresh }: Props) {
  const { t } = useLanguage();
  const initials = getInitials(user.displayName || user.name);

  return (
    <section className={`relative overflow-hidden ${dashPanel}`}>
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
            <p className="mt-1 text-sm text-[#c4c6cf]">
              {user.firmName || t.dashboard.workspace}
            </p>
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
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-60 cursor-pointer md:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t.dashboard.profileRefresh}
        </button>
      </div>
    </section>
  );
}
