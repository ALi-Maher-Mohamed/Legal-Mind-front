"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { ROUTES } from "@/config/routes";
import AuthToolbar from "./AuthToolbar";
import { Logo } from "@/components/common/logo";

export default function AuthHeader() {
  const { t, isRtl } = useLanguage();
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <header className="relative z-20 space-y-5 mb-6">
      <div className="flex items-center justify-between gap-3">
        <Logo />
        <AuthToolbar />
      </div>

      <Link
        href={ROUTES.home}
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-brand transition"
      >
        <BackIcon className="h-3.5 w-3.5" />
        {t.auth.backHome}
      </Link>
    </header>
  );
}
