'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/config/routes';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';
import type { DashboardView } from '@/types/dashboard.types';
import { MOCK_DOCUMENTS } from '../data/mockDocuments';
import DashboardShell from '../components/DashboardShell';
import DashboardHome from '../components/DashboardHome';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [view, setView] = useState<DashboardView>('dashboard');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      router.replace(ROUTES.login);
      return;
    }
    setUser(session.user);
    setReady(true);
  }, [router]);

  if (!ready || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted">{t.common.loading}</p>
      </div>
    );
  }

  const placeholderTitle =
    view === 'consultation'
      ? t.dashboard.navConsultation
      : view === 'evidence'
        ? t.dashboard.navEvidence
        : view === 'drafter'
          ? t.dashboard.navDrafter
          : view === 'gazette'
            ? t.dashboard.navGazette
            : t.dashboard.navSettings;

  return (
    <DashboardShell user={user} view={view} onNavigate={setView}>
      {view === 'dashboard' ? (
        <DashboardHome user={user} documents={MOCK_DOCUMENTS} onNavigate={setView} />
      ) : (
        <div className="mx-auto max-w-lg rounded-2xl border border-brand/15 bg-white p-10 text-center dark:bg-white/5 dark:border-white/10">
          <h2 className="text-xl font-bold text-foreground">{placeholderTitle}</h2>
          <p className="mt-2 text-sm text-muted">{t.dashboard.comingSoon}</p>
          <button
            type="button"
            onClick={() => setView('dashboard')}
            className="mt-6 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand hover:opacity-90 cursor-pointer"
          >
            {t.dashboard.backDesk}
          </button>
        </div>
      )}
    </DashboardShell>
  );
}
