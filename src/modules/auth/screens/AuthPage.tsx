'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import { authService } from '@/services/auth.service';
import type { RegisterDraft } from '@/types/auth.types';
import { useAuthMode } from '../hooks/useAuthMode';
import { buildAuthUser } from '../lib/buildAuthUser';
import AuthHeader from '../components/AuthHeader';
import AuthBrandPanel from '../components/AuthBrandPanel';
import AuthModeTabs from '../components/AuthModeTabs';
import AuthSecureFooter from '../components/AuthSecureFooter';
import LoginForm from '../sections/login/LoginForm';
import RegisterForm from '../sections/register/RegisterForm';
import OnboardingFlow from '../sections/onboarding/OnboardingFlow';

export default function AuthPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const { mode, goLogin, goRegister, goOnboarding } = useAuthMode('login');
  const draftRef = useRef<RegisterDraft | null>(null);
  const loginEmailRef = useRef('counselor@firm.com');

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

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 md:p-10 lg:p-14 min-h-screen relative">
        <div className="absolute top-1/4 start-1/4 w-[280px] h-[280px] rounded-full bg-brand/10 blur-[100px] pointer-events-none" />
        <AuthHeader />
        <div className="relative z-10 max-w-md w-full mx-auto my-auto py-8">
          <AuthModeTabs mode={mode} onLogin={goLogin} onRegister={goRegister} />
          {mode === 'login' && (
            <LoginForm onSuccess={handleLoginSuccess} onSwitchRegister={goRegister} />
          )}
          {mode === 'register' && (
            <RegisterForm onComplete={handleRegisterComplete} onLoginInstead={goLogin} />
          )}
          {mode === 'onboarding' && <OnboardingFlow onComplete={handleAuthComplete} />}
        </div>
        <AuthSecureFooter />
      </div>
      <AuthBrandPanel />
    </div>
  );
}
