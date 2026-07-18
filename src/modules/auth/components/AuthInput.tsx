'use client';

import React from 'react';

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  /** @deprecated Direction follows document `dir` */
  isRtl?: boolean;
};

export default function AuthInput({ icon, trailing, className = '', ...props }: AuthInputProps) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-muted group-focus-within:text-brand">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full rounded-lg border border-brand/15 bg-white py-3 text-sm text-foreground placeholder:text-muted text-start shadow-[0_1px_2px_rgba(0,62,199,0.04)] focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition dark:border-white/10 dark:bg-white/5 dark:text-[#dae2fd] dark:placeholder:text-[#8e9099] dark:shadow-none ${
          icon ? 'ps-10 pe-4' : 'px-4'
        } ${trailing ? 'pe-10' : ''} ${className}`}
      />
      {trailing && (
        <div className="absolute inset-y-0 end-2 flex items-center">{trailing}</div>
      )}
    </div>
  );
}
