'use client';

import { useState } from 'react';
import { Scale, UserRound } from 'lucide-react';
import { getAuthorInitials } from '../../lib/blogHelpers';

type CoverProps = {
  src?: string | null;
  alt?: string;
  className?: string;
  iconClassName?: string;
  /** `cover` fills the box (cards). `contain` shows the full image. */
  fit?: 'cover' | 'contain';
};

/** Cover image with navy/gold placeholder when missing or broken. */
export function BlogCover({
  src,
  alt = '',
  className = '',
  iconClassName = 'h-10 w-10',
  fit = 'cover',
}: CoverProps) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(src) && !broken;
  const isContain = fit === 'contain';

  return (
    <div
      className={`relative overflow-hidden bg-[#e8eef8] dark:bg-white/5 ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          className={
            isContain
              ? 'mx-auto block h-auto max-h-[560px] w-full object-contain'
              : 'absolute inset-0 h-full w-full object-cover'
          }
          onError={() => setBroken(true)}
        />
      ) : (
        <div
          className={`${
            isContain ? 'flex min-h-40' : 'absolute inset-0 flex'
          } items-center justify-center bg-gradient-to-br from-[#002045] via-[#1a365d] to-[#775a19]/70`}
          aria-hidden
        >
          <Scale className={`${iconClassName} text-[#fed488]/55`} />
        </div>
      )}
    </div>
  );
}

type AvatarProps = {
  src?: string | null;
  name?: string;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
};

/** Author avatar with initials / icon fallback. */
export function BlogAuthorAvatar({
  src,
  name = '',
  className = 'h-8 w-8',
  textClassName = 'text-[10px]',
  iconClassName = 'h-3.5 w-3.5',
}: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(src) && !broken;
  const initials = getAuthorInitials(name);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <span
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a365d] to-[#002045] font-bold text-[#fed488] ${textClassName}`}
        >
          {initials || <UserRound className={`${iconClassName} text-[#fed488]/85`} />}
        </span>
      )}
    </div>
  );
}
