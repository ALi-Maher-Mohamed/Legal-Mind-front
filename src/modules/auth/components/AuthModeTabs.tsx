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
  if (mode === 'onboarding') return null;

  const tab = (active: boolean) =>
    `flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 cursor-pointer ${
      active
        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
        : 'text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white'
    }`;

  return (
    <div
      className="flex p-1 mb-6 rounded-2xl border border-slate-200 bg-slate-100/80 dark:border-white/10 dark:bg-white/5"
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
