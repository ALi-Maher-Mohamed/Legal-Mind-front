'use client';

import { Sun, Moon, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useThemeContext } from '@/lib/providers/ThemeProvider';

export default function AuthToolbar() {
  const { locale, toggleLanguage, isRtl } = useLanguage();
  const { theme, toggleTheme } = useThemeContext();

  const btnClass =
    'flex items-center justify-center gap-1.5 h-9 min-w-9 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer';

  return (
    <div className="flex items-center gap-2" role="toolbar" aria-label="Preferences">
      <button
        type="button"
        onClick={toggleTheme}
        className={btnClass}
        aria-label={theme === 'dark' ? (isRtl ? 'الوضع الفاتح' : 'Light mode') : isRtl ? 'الوضع الداكن' : 'Dark mode'}
      >
        {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={toggleLanguage}
        className={btnClass}
        aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
      >
        <Globe className="h-4 w-4 text-blue-500" />
        <span className="text-[11px] font-semibold tracking-wide">{locale === 'ar' ? 'EN' : 'عر'}</span>
      </button>
    </div>
  );
}
