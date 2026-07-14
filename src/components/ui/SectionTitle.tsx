// src/components/ui/SectionTitle.tsx
'use client';

import React from 'react';

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left' | 'right';
  className?: string;
}

export function SectionTitle({
  badge,
  title,
  subtitle,
  align = 'center',
  className = ''
}: SectionTitleProps) {
  const alignmentClass = {
    center: "text-center mx-auto items-center justify-center",
    left: "text-left items-start justify-start",
    right: "text-right items-end justify-end"
  };

  return (
    <div className={`flex flex-col mb-12 md:mb-16 ${alignmentClass[align]} ${className}`}>
      {badge && (
        <span className="mb-3 inline-block rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-600 border border-blue-500/20 uppercase">
          {badge}
        </span>
      )}
      
      <h2 className="relative max-w-2xl text-2xl font-bold tracking-tight text-slate-100 md:text-4xl dark:text-slate-100">
        {title}
        {/* Glow accent bar below title */}
        <span className="mt-3 block h-1 w-12 rounded bg-gradient-to-r from-blue-500 to-amber-400 mx-auto md:w-20" />
      </h2>

      {subtitle && (
        <p className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base leading-relaxed dark:text-slate-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;