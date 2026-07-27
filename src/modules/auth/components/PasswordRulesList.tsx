'use client';

import { Check, Circle } from 'lucide-react';
import { getPasswordRules } from '../lib/validation';

type Props = {
  password: string;
};

export default function PasswordRulesList({ password }: Props) {
  const rules = getPasswordRules(password);

  return (
    <ul className="space-y-2 rounded-xl border border-brand/10 bg-[#f0f4ff]/70 p-3 dark:border-white/10 dark:bg-white/5">
      {rules.map((rule) => (
        <li key={rule.id} className="flex items-start gap-2 text-start text-xs">
          <span
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
              rule.passed
                ? 'bg-brand text-on-brand'
                : 'bg-transparent text-muted'
            }`}
            aria-hidden
          >
            {rule.passed ? <Check className="h-3 w-3" strokeWidth={3} /> : <Circle className="h-3 w-3" />}
          </span>
          <span className={rule.passed ? 'text-foreground font-medium' : 'text-muted'}>
            {rule.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
