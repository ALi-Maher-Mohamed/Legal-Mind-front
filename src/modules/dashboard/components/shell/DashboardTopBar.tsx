'use client';

import { LogOut, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useThemeContext } from '@/lib/providers/ThemeProvider';
import { LanguageSwitch } from '@/components/ui';

type Props = { onLogout: () => void };

export default function DashboardTopBar({ onLogout }: Props) {
  const { t, isRtl } = useLanguage();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-brand/15 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-background/90 sm:px-6">
      <div className="md:hidden">
        <span className="text-sm font-bold text-foreground">
          {t.common.brandName}
          <span className="ms-1 text-brand">{t.common.brandSuffix}</span>
        </span>
      </div>
      <p className="hidden text-sm text-muted md:block">{t.dashboard.workspace}</p>

      <div className="flex items-center gap-2">
        <LanguageSwitch />
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand/15 bg-[#f0f4ff] text-muted transition hover:text-foreground dark:border-white/10 dark:bg-white/5 cursor-pointer"
          aria-label={theme === 'dark' ? (isRtl ? 'فاتح' : 'Light') : isRtl ? 'داكن' : 'Dark'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-brand/15 bg-[#f0f4ff] text-muted dark:border-white/10 dark:bg-white/5 cursor-pointer"
          aria-label={t.dashboard.logout}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
