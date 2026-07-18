'use client';

import { LogOut } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';

type Props = {
  user: AuthUser;
  onLogout: () => void;
};

export default function SidebarUser({ user, onLogout }: Props) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2 border-t border-outline/40 p-3">
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
        onClick={onLogout}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-surface-raised hover:text-foreground cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
        {t.dashboard.logout}
      </button>
    </div>
  );
}
