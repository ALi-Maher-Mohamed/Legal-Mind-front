'use client';

import React from 'react';

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'start' | 'end' | 'left' | 'right';
  className?: string;
}

export function SectionTitle({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionTitleProps) {
  const normalizedAlign = align === 'left' ? 'start' : align === 'right' ? 'end' : align;

  const alignmentClass = {
    center: 'text-center mx-auto items-center justify-center',
    start: 'text-start items-start justify-start',
    end: 'text-end items-end justify-end',
  };

  return (
    <div className={`flex flex-col mb-10 md:mb-12 ${alignmentClass[normalizedAlign]} ${className}`}>
      {badge && (
        <span className="mb-2.5 inline-block text-xs font-semibold tracking-[0.1em] text-brand uppercase">
          {badge}
        </span>
      )}

      <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground md:text-[32px] md:leading-10">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 max-w-2xl text-sm text-muted md:text-base leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

export default SectionTitle;
