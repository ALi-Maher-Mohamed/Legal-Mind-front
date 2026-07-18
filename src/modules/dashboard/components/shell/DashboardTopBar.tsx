'use client';

import { LogOut, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useThemeContext } from '@/lib/providers/ThemeProvider';
import SegmentSwitch from '../ui/SegmentSwitch';

type Props = { onLogout: () => void };

export default function DashboardTopBar({ onLogout }: Props) {
  const { t, locale, toggleLanguage, isRtl } = useLanguage();
  const { theme, toggleTheme } = useThemeContext();
  const isAr = locale === 'ar';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-outline/40 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="md:hidden">
        <span className="text-sm font-bold text-foreground">
          {t.common.brandName}
          <span className="ms-1 text-brand">{t.common.brandSuffix}</span>
        </span>
      </div>
      <p className="hidden text-sm text-muted md:block">{t.dashboard.workspace}</p>

      <div className="flex items-center gap-2">
        <SegmentSwitch
          checked={isAr}
          onToggle={toggleLanguage}
          leftLabel="EN"
          rightLabel="عر"
          ariaLabel={isAr ? 'Switch to English' : 'التبديل للعربية'}
        />
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline bg-surface-raised text-muted transition hover:text-foreground cursor-pointer"
          aria-label={theme === 'dark' ? (isRtl ? 'فاتح' : 'Light') : isRtl ? 'داكن' : 'Dark'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-outline bg-surface-raised text-muted cursor-pointer"
          aria-label={t.dashboard.logout}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
