'use client';

import { UserRound } from 'lucide-react';
import type { AuthUser } from '@/types/auth.types';
import { getInitials } from './lib/getInitials';

type Props = {
  user: AuthUser;
  className?: string;
  textClassName?: string;
  roundedClassName?: string;
};

export default function UserAvatar({
  user,
  className = 'h-8 w-8',
  textClassName = 'text-xs',
  roundedClassName = 'rounded-full',
}: Props) {
  const initials = getInitials(user.name);

  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={`${className} ${roundedClassName} object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-brand/15 font-bold text-brand ${className} ${roundedClassName} ${textClassName}`}
    >
      {initials || <UserRound className="h-1/2 w-1/2" />}
    </div>
  );
}
