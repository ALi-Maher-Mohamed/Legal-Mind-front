'use client';

import React from 'react';

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  /** @deprecated Direction follows document `dir`; kept for call-site compatibility */
  isRtl?: boolean;
};

export default function AuthInput({ icon, trailing, className = '', ...props }: AuthInputProps) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full rounded-xl bg-white/5 border border-white/10 py-3 text-sm text-white placeholder-gray-500 text-start focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
          icon ? 'ps-10 pe-4' : 'px-4'
        } ${trailing ? 'pe-10' : ''} ${className}`}
      />
      {trailing && (
        <div className="absolute inset-y-0 end-2 flex items-center">{trailing}</div>
      )}
    </div>
  );
}
