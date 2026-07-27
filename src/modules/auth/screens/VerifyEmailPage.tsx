"use client";

import AuthHeader from "../components/AuthHeader";
import AuthBrandPanel from "../components/AuthBrandPanel";
import AuthSecureFooter from "../components/AuthSecureFooter";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import VerifyEmailStatus from "../sections/verify/VerifyEmailStatus";

type Props = {
  token: string | null;
};

export default function VerifyEmailPage({ token }: Props) {
  const { status, retry } = useVerifyEmail(token);

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <div className="relative flex min-h-screen w-full flex-col justify-between p-6 md:p-10 lg:w-1/2 lg:p-14">
        <div className="pointer-events-none absolute start-1/4 top-1/4 h-[280px] w-[280px] rounded-full bg-brand/10 blur-[100px]" />
        <AuthHeader />
        <div className="relative z-10 mx-auto my-auto w-full max-w-md py-8">
          <VerifyEmailStatus status={status} onRetry={() => void retry()} />
        </div>
        <AuthSecureFooter />
      </div>
      <AuthBrandPanel />
    </div>
  );
}
