// src/components/ui/Button.tsx
'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98 select-none";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base"
  };

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] border border-blue-500/20 dark:border-blue-500/20",
    secondary: "bg-white shadow-sm text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-white",
    gold: "bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)] dark:bg-slate-900 dark:text-amber-200 dark:border-slate-700 dark:hover:bg-slate-800",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
export default Button;
