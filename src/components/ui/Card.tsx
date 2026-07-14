// src/components/ui/Card.tsx
'use client';

import React, { useRef, useState } from 'react';

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
  glowColor = 'rgba(59,130,246,0.15)',
  onClick,
  hoverGlow = true,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 backdrop-blur-lg transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-slate-700 ${onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' : ''} ${className}`}
    >
      {hoverGlow && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

export default Card;
