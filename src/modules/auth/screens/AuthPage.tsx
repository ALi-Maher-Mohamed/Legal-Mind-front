'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import type { AuthMode } from '@/types/auth.types';
import { useAuthMode } from '../hooks/useAuthMode';
import AuthHeader from '../components/AuthHeader';
import AuthBrandPanel from '../components/AuthBrandPanel';
import AuthModeTabs from '../components/AuthModeTabs';
import AuthSecureFooter from '../components/AuthSecureFooter';
import LoginForm from '../sections/login/LoginForm';
import RegisterForm from '../sections/register/RegisterForm';
import OnboardingFlow from '../sections/onboarding/OnboardingFlow';
import ForgotPasswordForm from '../sections/recovery/ForgotPasswordForm';
import ResetPasswordForm from '../sections/recovery/ResetPasswordForm';

type Props = {
  initialMode?: AuthMode;
  resetToken?: string | null;
};

export default function AuthPage({ initialMode = 'login', resetToken = null }: Props) {
  const router = useRouter();
  const { mode, goLogin, goRegister, goOnboarding, goForgot } = useAuthMode(initialMode);

  const enterDashboard = () => {
    router.push(ROUTES.dashboard);
  };

  const showTabs = mode === 'login' || mode === 'register';

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 lg:w-1/2 lg:p-14">
        <div className="pointer-events-none absolute start-1/4 top-1/4 h-[280px] w-[280px] rounded-full bg-brand/10 blur-[100px]" />
        <AuthHeader />
        <div className="relative z-10 mx-auto my-auto w-full max-w-md py-8">
          {showTabs && <AuthModeTabs mode={mode} onLogin={goLogin} onRegister={goRegister} />}

          {mode === 'login' && (
            <LoginForm
              onSuccess={() => goOnboarding()}
              onSwitchRegister={goRegister}
              onForgotPassword={goForgot}
            />
          )}
          {mode === 'register' && (
            <RegisterForm
              onComplete={(email) => {
                router.push(`${ROUTES.checkEmail}?email=${encodeURIComponent(email)}`);
              }}
              onLoginInstead={goLogin}
            />
          )}
          {mode === 'onboarding' && <OnboardingFlow onComplete={enterDashboard} />}
          {mode === 'forgot' && <ForgotPasswordForm onBackLogin={goLogin} />}
          {mode === 'reset' && (
            <ResetPasswordForm
              token={resetToken}
              onSuccess={enterDashboard}
              onBackLogin={goLogin}
            />
          )}
        </div>
        <AuthSecureFooter />
      </div>
      <AuthBrandPanel />
    </div>
  );
}
