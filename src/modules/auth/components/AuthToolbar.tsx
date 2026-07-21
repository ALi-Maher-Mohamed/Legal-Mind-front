'use client';

import { Sun, Moon } from 'lucide-react';
import { useThemeContext } from '@/lib/providers/ThemeProvider';

export default function AuthToolbar() {
  const { theme, toggleTheme } = useThemeContext();

  const btnClass =
    'flex items-center justify-center gap-1.5 h-9 min-w-9 px-2.5 rounded-lg border border-outline/50 bg-surface-raised text-muted hover:bg-[#f0f4ff] hover:text-foreground dark:hover:bg-white/10 dark:hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 cursor-pointer';

  return (
    <div className="flex items-center gap-2" role="toolbar" aria-label="التفضيلات">
      <button
        type="button"
        onClick={toggleTheme}
        className={btnClass}
        aria-label={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
      >
        {theme === 'dark' ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}
