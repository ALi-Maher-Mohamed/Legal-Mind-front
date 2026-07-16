'use client';

import React from 'react';

type AuthInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  isRtl?: boolean;
};

export default function AuthInput({ icon, trailing, isRtl, className = '', ...props }: AuthInputProps) {
  return (
    <div className="relative group">
      {icon && (
        <div
          className={`absolute inset-y-0 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 ${
            isRtl ? 'right-3' : 'left-3'
          }`}
        >
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full rounded-xl bg-white/5 border border-white/10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${
          icon ? (isRtl ? 'pr-10' : 'pl-10') : 'px-4'
        } ${trailing ? (isRtl ? 'pl-10' : 'pr-10') : ''} ${isRtl ? 'text-right' : 'text-left'} ${className}`}
      />
      {trailing && (
        <div className={`absolute inset-y-0 flex items-center ${isRtl ? 'left-2' : 'right-2'}`}>{trailing}</div>
      )}
    </div>
  );
}
