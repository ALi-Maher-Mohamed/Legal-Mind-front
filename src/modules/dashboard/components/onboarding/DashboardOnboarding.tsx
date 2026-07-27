'use client';

import AuthBrandPanel from '@/modules/auth/components/AuthBrandPanel';
import AuthHeader from '@/modules/auth/components/AuthHeader';
import AuthSecureFooter from '@/modules/auth/components/AuthSecureFooter';
import OnboardingFlow from '@/modules/auth/sections/onboarding/OnboardingFlow';

type Props = {
  onComplete: () => void;
};

export default function DashboardOnboarding({ onComplete }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 lg:w-1/2 lg:p-14">
        <div className="pointer-events-none absolute start-1/4 top-1/4 h-[280px] w-[280px] rounded-full bg-brand/10 blur-[100px]" />
        <AuthHeader />
        <div className="relative z-10 mx-auto my-auto w-full max-w-md py-8">
          <OnboardingFlow onComplete={onComplete} />
        </div>
        <AuthSecureFooter />
      </div>
      <AuthBrandPanel />
    </div>
  );
}
