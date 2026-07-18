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
      className={`relative overflow-hidden rounded-2xl border border-outline/40 bg-card backdrop-blur-[6px] transition-all duration-300 dark:border-white/10 dark:bg-[rgba(23,31,51,0.6)] ${
        onClick || hoverGlow ? 'hover:border-brand/30 cursor-pointer' : ''
      } ${className}`}
    >
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

export default Card;
