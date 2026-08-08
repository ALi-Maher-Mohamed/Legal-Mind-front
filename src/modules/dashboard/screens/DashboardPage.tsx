"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/config/routes";
import { toastApiError } from "@/lib/api/toast";
import BrandSplash from "@/components/common/BrandSplash";
import { useSplashGate } from "@/hooks/useSplashGate";
import {
  hasCompletedOnboarding,
  markOnboardingCompleted,
} from "@/modules/auth/lib/onboardingStorage";
import type { AuthUser } from "@/types/auth.types";
import type { DashboardView } from "@/types/dashboard.types";
import { MOCK_DOCUMENTS } from "../data/mockDocuments";
import DashboardShell from "../components/shell/DashboardShell";
import DashboardHome from "../components/home/DashboardHome";
import AnalysisRoom from "../components/analysis/AnalysisRoom";
import ConsultationRoom from "../components/consultation/ConsultationRoom";
import DraftersStudio from "../components/drafter/DraftersStudio";
import ProfileView from "../components/profile/ProfileView";
import GazetteView from "../components/gazette/GazetteView";

import ComingSoonPanel from "../components/ComingSoonPanel";
import DashboardOnboarding from "../components/onboarding/DashboardOnboarding";

const VIEW_QUERY_VALUES: DashboardView[] = [
  "dashboard",
  "analysis",
  "gazette",
  "consultation",
  "drafter",
  "profile",
];

function resolveViewParam(value: string | null): DashboardView | null {
  if (!value) return null;
  return VIEW_QUERY_VALUES.includes(value as DashboardView)
    ? (value as DashboardView)
    : null;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [view, setView] = useState<DashboardView>(
    () => resolveViewParam(searchParams.get("view")) || "dashboard",
  );
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const showSplash = useSplashGate(ready && Boolean(user), 1800);

  useEffect(() => {
    const fromQuery = resolveViewParam(searchParams.get("view"));
    if (fromQuery) setView(fromQuery);
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const session = await authService.restoreSession();
        if (!active) return;

        if (!session) {
          router.replace(ROUTES.login);
          return;
        }

        setUser(session.user);
        setShowOnboarding(!hasCompletedOnboarding(session.user.id));
        setReady(true);

        const freshUser = await authService.me();
        if (!active) return;
        setUser(freshUser);
        setShowOnboarding(!hasCompletedOnboarding(freshUser.id));
      } catch (error) {
        authService.clearSession();
        toastApiError(error, "انتهت الجلسة. سجّل الدخول مجدداً");
        router.replace(ROUTES.login);
      }
    };

    void bootstrap();
    return () => {
      active = false;
    };
  }, [router]);

  if (showSplash || !ready || !user) {
    return <BrandSplash />;
  }

  if (showOnboarding) {
    return (
      <DashboardOnboarding
        onComplete={() => {
          markOnboardingCompleted(user.id);
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <DashboardShell user={user} view={view} onNavigate={setView}>
      {view === "dashboard" ? (
        <DashboardHome
          user={user}
          documents={MOCK_DOCUMENTS}
          onNavigate={setView}
        />
      ) : view === "analysis" ? (
        <AnalysisRoom />
      ) : view === "gazette" ? (
        <GazetteView />
      ) : view === "consultation" ? (
        <ConsultationRoom />
      ) : view === "drafter" ? (
        <DraftersStudio />
      ) : view === "profile" ? (
        <ProfileView user={user} onUserUpdate={setUser} />
      ) : (
        <ComingSoonPanel view={view} onBack={() => setView("dashboard")} />
      )}
    </DashboardShell>
  );
}
