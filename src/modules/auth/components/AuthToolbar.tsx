'use client';

import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useThemeContext } from '@/lib/providers/ThemeProvider';
import { LanguageSwitch } from '@/components/ui';

export default function AuthToolbar() {
  const { isRtl } = useLanguage();
  const { theme, toggleTheme } = useThemeContext();

  const btnClass =
    'flex items-center justify-center gap-1.5 h-9 min-w-9 px-2.5 rounded-lg border border-outline/50 bg-surface-raised text-muted hover:bg-[#f0f4ff] hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 cursor-pointer';

  return (
    <div className="flex items-center gap-2" role="toolbar" aria-label="Preferences">
      <button
        type="button"
        onClick={toggleTheme}
        className={btnClass}
        aria-label={theme === 'dark' ? (isRtl ? 'الوضع الفاتح' : 'Light mode') : isRtl ? 'الوضع الداكن' : 'Dark mode'}
      >
        {theme === 'dark' ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4" />}
      </button>
      <LanguageSwitch />
    </div>
  );
}
