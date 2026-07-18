'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  PenLine,
  Newspaper,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useThemeContext } from '@/lib/providers/ThemeProvider';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/config/routes';
import type { AuthUser } from '@/types/auth.types';
import type { DashboardView } from '@/types/dashboard.types';

type Props = {
  user: AuthUser;
  view: DashboardView;
  onNavigate: (view: DashboardView) => void;
  children: React.ReactNode;
};

const NAV_ITEMS: { id: DashboardView; icon: typeof LayoutDashboard; labelKey: 'navDashboard' | 'navConsultation' | 'navEvidence' | 'navDrafter' | 'navGazette' | 'navSettings' }[] = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'navDashboard' },
  { id: 'consultation', icon: MessageSquare, labelKey: 'navConsultation' },
  { id: 'evidence', icon: FolderOpen, labelKey: 'navEvidence' },
  { id: 'drafter', icon: PenLine, labelKey: 'navDrafter' },
  { id: 'gazette', icon: Newspaper, labelKey: 'navGazette' },
  { id: 'settings', icon: Settings, labelKey: 'navSettings' },
];

export default function DashboardShell({ user, view, onNavigate, children }: Props) {
  const router = useRouter();
  const { t, locale, toggleLanguage, isRtl } = useLanguage();
  const { theme, toggleTheme } = useThemeContext();
  const isAr = locale === 'ar';

  const handleLogout = () => {
    authService.clearSession();
    router.push(ROUTES.login);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-e border-outline/40 bg-card">
        <div className="border-b border-outline/40 px-5 py-5">
          <Link href={ROUTES.home} className="block select-none">
            <span className="text-base font-bold tracking-tight text-foreground">
              {t.common.brandName}
              <span className="ms-1 text-brand">{t.common.brandSuffix}</span>
            </span>
          </Link>
          <p className="mt-1 text-[11px] text-muted truncate">{user.firmName || t.dashboard.workspace}</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition cursor-pointer text-start ${
                  active
                    ? 'bg-brand text-on-brand shadow-[0_2px_8px_rgba(0,62,199,0.2)]'
                    : 'text-muted hover:bg-surface-raised hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t.dashboard[item.labelKey]}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-outline/40 p-3 space-y-2">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-[10px] text-muted">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:bg-surface-raised hover:text-foreground transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {t.dashboard.logout}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-outline/40 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="md:hidden">
            <span className="text-sm font-bold text-foreground">
              {t.common.brandName}
              <span className="ms-1 text-brand">{t.common.brandSuffix}</span>
            </span>
          </div>
          <p className="hidden text-sm text-muted md:block">{t.dashboard.workspace}</p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              dir="ltr"
              aria-checked={isAr}
              onClick={toggleLanguage}
              className="relative inline-flex h-9 w-[5.5rem] items-center rounded-full border border-outline/50 bg-surface-raised p-1 cursor-pointer"
            >
              <span
                aria-hidden
                className={`absolute top-1 bottom-1 start-1 w-[calc(50%-4px)] rounded-full bg-brand transition-transform duration-200 ${
                  isAr ? 'translate-x-full' : 'translate-x-0'
                }`}
              />
              <span className={`relative z-10 flex-1 text-center text-[10px] font-semibold ${!isAr ? 'text-on-brand' : 'text-muted'}`}>
                EN
              </span>
              <span className={`relative z-10 flex-1 text-center text-[10px] font-semibold ${isAr ? 'text-on-brand' : 'text-muted'}`}>
                عر
              </span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline/50 text-muted hover:bg-surface-raised hover:text-foreground transition cursor-pointer"
              aria-label={theme === 'dark' ? (isRtl ? 'فاتح' : 'Light') : isRtl ? 'داكن' : 'Dark'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-outline/50 text-muted hover:bg-surface-raised cursor-pointer"
              aria-label={t.dashboard.logout}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-b border-outline/30 px-3 py-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  active ? 'bg-brand text-on-brand' : 'bg-surface-raised text-muted'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.dashboard[item.labelKey]}
              </button>
            );
          })}
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
