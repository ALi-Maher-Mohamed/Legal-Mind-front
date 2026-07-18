'use client';

import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useThemeContext } from '@/lib/providers/ThemeProvider';

export default function AuthToolbar() {
  const { locale, toggleLanguage, isRtl } = useLanguage();
  const { theme, toggleTheme } = useThemeContext();
  const isAr = locale === 'ar';

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

      <button
        type="button"
        role="switch"
        dir="ltr"
        aria-checked={isAr}
        aria-label={isAr ? 'Switch to English' : 'التبديل للعربية'}
        onClick={toggleLanguage}
        className="relative inline-flex h-9 w-[4.75rem] items-center rounded-full border border-outline/50 bg-surface-raised p-0.5 cursor-pointer select-none"
      >
        <span
          className={`absolute top-0.5 bottom-0.5 start-0.5 w-[calc(50%-2px)] rounded-full bg-brand shadow-sm transition-transform duration-200 ${
            isAr ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
          }`}
        />
        <span className={`relative z-10 flex-1 text-center text-[10px] font-semibold ${!isAr ? 'text-on-brand' : 'text-muted'}`}>
          EN
        </span>
        <span className={`relative z-10 flex-1 text-center text-[10px] font-semibold ${isAr ? 'text-on-brand' : 'text-muted'}`}>
          عر
        </span>
      </button>
    </div>
  );
}
