'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import { authService } from '@/services/auth.service';
import type { AuthMode, RegisterDraft } from '@/types/auth.types';
import { useAuthMode } from '../hooks/useAuthMode';
import { buildAuthUser } from '../lib/buildAuthUser';
import AuthHeader from '../components/AuthHeader';
import AuthBrandPanel from '../components/AuthBrandPanel';
import AuthModeTabs from '../components/AuthModeTabs';
import AuthSecureFooter from '../components/AuthSecureFooter';
import LoginForm from '../sections/login/LoginForm';
import RegisterForm from '../sections/register/RegisterForm';
import OnboardingFlow from '../sections/onboarding/OnboardingFlow';
import ForgotPasswordForm from '../sections/recovery/ForgotPasswordForm';
import OtpForm from '../sections/recovery/OtpForm';
import ResetPasswordForm from '../sections/recovery/ResetPasswordForm';

type Props = {
  initialMode?: AuthMode;
};

export default function AuthPage({ initialMode = 'login' }: Props) {
  const router = useRouter();
  const { locale } = useLanguage();
  const { mode, goLogin, goRegister, goOnboarding, goForgot, goOtp, goReset } =
    useAuthMode(initialMode);
  const draftRef = useRef<RegisterDraft | null>(null);
  const loginEmailRef = useRef('counselor@firm.com');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');

  useEffect(() => {
    const stored = authService.getRecoveryEmail();
    if (stored) setRecoveryEmail(stored);
    if ((initialMode === 'otp' || initialMode === 'reset') && !stored) {
      goForgot();
    }
  }, [initialMode, goForgot]);

  const handleLoginSuccess = (email: string) => {
    loginEmailRef.current = email;
    goOnboarding();
  };

  const handleRegisterComplete = (draft: RegisterDraft) => {
    draftRef.current = draft;
    loginEmailRef.current = draft.email;
    goOnboarding();
  };

  const handleAuthComplete = () => {
    const draft = draftRef.current ?? {
      name: '',
      email: loginEmailRef.current,
      password: '',
      firmName: '',
      barId: '',
      teamSize: '1',
      selectedPractices: [],
    };
    const user = buildAuthUser({ draft, loginEmail: loginEmailRef.current, locale });
    authService.persistSession(user, `mock-jwt-${user.id}`);
    router.push(ROUTES.dashboard);
  };

  const showTabs = mode === 'login' || mode === 'register';
  const email = recoveryEmail || authService.getRecoveryEmail();

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 lg:w-1/2 lg:p-14">
        <div className="pointer-events-none absolute start-1/4 top-1/4 h-[280px] w-[280px] rounded-full bg-brand/10 blur-[100px]" />
        <AuthHeader />
        <div className="relative z-10 mx-auto my-auto w-full max-w-md py-8">
          {showTabs && <AuthModeTabs mode={mode} onLogin={goLogin} onRegister={goRegister} />}

          {mode === 'login' && (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchRegister={goRegister}
              onForgotPassword={goForgot}
            />
          )}
          {mode === 'register' && (
            <RegisterForm onComplete={handleRegisterComplete} onLoginInstead={goLogin} />
          )}
          {mode === 'onboarding' && <OnboardingFlow onComplete={handleAuthComplete} />}
          {mode === 'forgot' && (
            <ForgotPasswordForm
              onSent={(value) => {
                setRecoveryEmail(value);
                goOtp();
              }}
              onBackLogin={goLogin}
            />
          )}
          {mode === 'otp' && (
            <OtpForm
              email={email}
              onVerified={(otp) => {
                setRecoveryOtp(otp);
                goReset();
              }}
              onBack={goForgot}
            />
          )}
          {mode === 'reset' && (
            <ResetPasswordForm email={email} otp={recoveryOtp} onBackLogin={goLogin} />
          )}
        </div>
        <AuthSecureFooter />
      </div>
      <AuthBrandPanel />
    </div>
  );
}
