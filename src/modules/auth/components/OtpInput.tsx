'use client';

import { useRef } from 'react';

type Props = {
  value: string;
  onChange: (otp: string) => void;
  length?: number;
  disabled?: boolean;
};

export default function OtpInput({ value, onChange, length = 6, disabled }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  const focusAt = (index: number) => {
    refs.current[index]?.focus();
    refs.current[index]?.select();
  };

  const update = (next: string[]) => {
    onChange(next.join('').slice(0, length));
  };

  const handleChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      update(next);
      return;
    }

    const chars = cleaned.split('');
    const next = [...digits];
    let cursor = index;
    for (const ch of chars) {
      if (cursor >= length) break;
      next[cursor] = ch;
      cursor += 1;
    }
    update(next);
    focusAt(Math.min(cursor, length - 1));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault();
      const next = [...digits];
      next[index - 1] = '';
      update(next);
      focusAt(index - 1);
    }
    if (e.key === 'ArrowLeft' && index > 0) focusAt(index - 1);
    if (e.key === 'ArrowRight' && index < length - 1) focusAt(index + 1);
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-2.5" dir="ltr">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          className="h-12 w-10 rounded-xl border border-brand/15 bg-white text-center text-lg font-bold text-foreground shadow-[0_1px_2px_rgba(0,62,199,0.04)] transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:h-14 sm:w-11 dark:border-white/10 dark:bg-white/5 dark:text-[#dae2fd]"
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
