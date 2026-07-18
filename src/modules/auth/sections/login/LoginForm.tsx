'use client';

import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui';
import AuthInput from '../../components/AuthInput';
import { useLoginForm } from '../../hooks/useLoginForm';

type LoginFormProps = {
  onSuccess: (email: string) => void;
  onSwitchRegister: () => void;
  onForgotPassword: () => void;
};

export default function LoginForm({ onSuccess, onSwitchRegister, onForgotPassword }: LoginFormProps) {
  const { t } = useLanguage();
  const form = useLoginForm(onSuccess);

  return (
    <div className="space-y-6">
      <div className="text-start">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{t.auth.welcome}</h1>
        <p className="text-sm text-muted mt-2">{t.auth.subtitle}</p>
      </div>

      <form onSubmit={form.handleSubmit} className="space-y-5 mt-6">
        <AuthInput
          type="email"
          value={form.email}
          onChange={(e) => form.setEmail(e.target.value)}
          placeholder={t.auth.emailPlaceholder}
          required
          icon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />
        <AuthInput
          type={form.showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => form.setPassword(e.target.value)}
          placeholder={t.auth.passwordPlaceholder}
          required
          icon={<Lock className="h-4 w-4" />}
          autoComplete="current-password"
          trailing={
            <button
              type="button"
              onClick={() => form.setShowPassword(!form.showPassword)}
              className="p-1.5 text-muted hover:text-foreground rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              aria-label={form.showPassword ? 'Hide password' : 'Show password'}
            >
              {form.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="flex justify-between items-center text-xs gap-3 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer select-none text-muted">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) => form.setRememberMe(e.target.checked)}
              className="accent-[var(--lm-brand)] w-3.5 h-3.5 rounded"
            />
            {t.auth.rememberMe}
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-brand hover:opacity-80 transition cursor-pointer"
          >
            {t.auth.forgotPassword}
          </button>
        </div>

        {form.error && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {form.error}
          </p>
        )}

        <Button type="submit" variant="primary" fullWidth size="lg" isLoading={form.isLoading}>
          {t.auth.loginBtn}
        </Button>
      </form>

      <p className="text-center text-xs text-muted pt-2 border-t border-brand/10 dark:border-white/10">
        {t.auth.noAccount}{' '}
        <button
          type="button"
          onClick={onSwitchRegister}
          className="text-brand font-semibold hover:opacity-80 uppercase tracking-wider text-[11px]"
        >
          {t.auth.registerBtn}
        </button>
      </p>
    </div>
  );
}
