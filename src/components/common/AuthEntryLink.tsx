'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuthEntryPath, resolveAuthEntryPath } from '@/hooks/useAuthEntryPath';

type Props = {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export default function AuthEntryLink({ children, className, onNavigate }: Props) {
  const router = useRouter();
  const path = useAuthEntryPath();

  return (
    <Link
      href={path}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        router.push(resolveAuthEntryPath());
        onNavigate?.();
      }}
    >
      {children}
    </Link>
  );
}
