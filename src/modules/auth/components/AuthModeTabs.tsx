'use client';

import { useLanguage } from '@/hooks/useLanguage';
import type { AuthMode } from '@/types/auth.types';

type Props = {
  mode: AuthMode;
  onLogin: () => void;
  onRegister: () => void;
};

export default function AuthModeTabs({ mode, onLogin, onRegister }: Props) {
  const { t } = useLanguage();
  if (mode !== 'login' && mode !== 'register') return null;

  const tab = (active: boolean) =>
    `flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 cursor-pointer ${
      active
        ? 'bg-brand text-on-brand shadow-[0_4px_12px_rgba(0,62,199,0.2)]'
        : 'text-muted hover:text-foreground'
    }`;

  return (
    <div
      className="flex p-1 mb-6 rounded-xl border border-brand/15 bg-[#f0f4ff] dark:border-white/10 dark:bg-white/5"
      role="tablist"
      aria-label="Auth mode"
    >
      <button type="button" role="tab" aria-selected={mode === 'login'} className={tab(mode === 'login')} onClick={onLogin}>
        {t.auth.loginBtn}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'register'}
        className={tab(mode === 'register')}
        onClick={onRegister}
      >
        {t.auth.registerBtn}
      </button>
    </div>
  );
}
