'use client';

import { LogOut } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';
import UserAvatar from '../profile/UserAvatar';

type Props = {
  user: AuthUser;
  onLogout: () => void;
};

export default function SidebarUser({ user, onLogout }: Props) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2 border-t border-brand/15 p-3 dark:border-white/10">
      <div className="flex items-center gap-2 px-2 py-1">
        <UserAvatar user={user} className="h-8 w-8 shrink-0" textClassName="text-xs" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
          <p className="truncate text-[10px] text-muted">{user.email}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-surface-raised hover:text-foreground dark:hover:bg-white/5 cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
        {t.dashboard.logout}
      </button>
    </div>
  );
}
