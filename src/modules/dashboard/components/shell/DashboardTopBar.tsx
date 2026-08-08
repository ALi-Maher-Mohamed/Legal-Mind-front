'use client';

import Link from 'next/link';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useThemeContext } from '@/lib/providers/ThemeProvider';
import { ROUTES } from '@/config/routes';
import type { AuthUser } from '@/types/auth.types';
import UserAvatar from '../profile/UserAvatar';

type Props = {
  user: AuthUser;
  onLogout: () => void;
  onOpenProfile?: () => void;
};

export default function DashboardTopBar({ user, onLogout, onOpenProfile }: Props) {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-brand/15 bg-card/90 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-background/90 sm:px-6">
      <div className="min-w-0">
        <Link href={ROUTES.home} className="block select-none">
          <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">
            {t.common.brandName}
            <span className="ms-1 text-brand">{t.common.brandSuffix}</span>
          </span>
        </Link>
        <p className="mt-0.5 truncate text-[11px] text-muted">
          {user.firmName || t.dashboard.workspace}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenProfile}
          className="hidden items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-surface-raised dark:hover:bg-white/5 cursor-pointer sm:flex"
          aria-label={t.dashboard.navProfile}
        >
          <UserAvatar user={user} className="h-8 w-8 shrink-0" textClassName="text-xs" />
          <div className="min-w-0 max-w-[10rem] text-start">
            <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-[10px] text-muted">{user.email}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand/15 bg-surface-raised text-muted transition hover:text-foreground dark:border-white/10 dark:bg-white/5 cursor-pointer"
          aria-label={theme === 'dark' ? 'فاتح' : 'داكن'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand/15 bg-surface-raised text-muted transition hover:text-foreground dark:border-white/10 dark:bg-white/5 cursor-pointer"
          aria-label={t.dashboard.logout}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
