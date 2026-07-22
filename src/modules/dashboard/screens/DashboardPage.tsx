"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { ROUTES } from "@/config/routes";
import { useLanguage } from "@/hooks/useLanguage";
import type { AuthUser } from "@/types/auth.types";
import type { DashboardView } from "@/types/dashboard.types";
import { MOCK_DOCUMENTS } from "../data/mockDocuments";
import DashboardShell from "../components/shell/DashboardShell";
import DashboardHome from "../components/home/DashboardHome";
import AnalysisRoom from "../components/analysis/AnalysisRoom";
import ConsultationRoom from "../components/consultation/ConsultationRoom";
import DraftersStudio from "../components/drafter/DraftersStudio";
import ComingSoonPanel from "../components/ComingSoonPanel";

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [view, setView] = useState<DashboardView>("dashboard");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      router.replace(ROUTES.login);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(session.user);
    setReady(true);
  }, [router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff] dark:bg-background">
        <p className="text-sm text-muted">{t.common.loading}</p>
      </div>
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
      ) : view === "consultation" ? (
        <ConsultationRoom />
      ) : view === "drafter" ? (
        <DraftersStudio />
      ) : (
        <ComingSoonPanel view={view} onBack={() => setView("dashboard")} />
      )}
    </DashboardShell>
  );
}
