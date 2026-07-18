'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  hoverGlow?: boolean;
}

export function Card({
  children,
  className = '',
  onClick,
  hoverGlow = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-brand/15 bg-white shadow-[0_2px_8px_rgba(0,62,199,0.06)] transition-all duration-300 dark:border-white/10 dark:bg-[rgba(23,31,51,0.85)] dark:shadow-none dark:backdrop-blur-[6px] ${
        onClick || hoverGlow
          ? 'hover:border-brand/40 hover:shadow-[0_4px_12px_rgba(0,62,199,0.1)] cursor-pointer dark:hover:border-brand/30'
          : ''
      } ${className}`}
    >
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

export default Card;
