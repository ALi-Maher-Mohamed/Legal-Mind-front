'use client';

import { useState } from 'react';
import type { AuthUser } from '@/types/auth.types';
import type { DashboardView, LegalDocument } from '@/types/dashboard.types';
import DeskHeader from './DeskHeader';
import DeskEmptyState from './DeskEmptyState';
import StatsRow from './StatsRow';
import DocumentsStrip from './DocumentsStrip';
import ActivityFeed from './ActivityFeed';
import BulletinCard from './BulletinCard';
import DeskShortcuts from './DeskShortcuts';

type Props = {
  user: AuthUser;
  documents: LegalDocument[];
  onNavigate: (view: DashboardView) => void;
};

export default function DashboardHome({ user, documents, onNavigate }: Props) {
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <DeskHeader
        user={user}
        showEmpty={showEmpty}
        onToggleEmpty={() => setShowEmpty((v) => !v)}
      />

      {showEmpty ? (
        <DeskEmptyState onEnterEvidence={() => onNavigate('analysis')} />
      ) : (
        <>
          <StatsRow />
          <DocumentsStrip
            documents={documents}
            onOpenLibrary={() => onNavigate('analysis')}
          />

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-8">
              <ActivityFeed />
            </div>

            <aside className="flex flex-col gap-5 xl:col-span-4 xl:sticky xl:top-4 xl:self-start">
              <DeskShortcuts onNavigate={onNavigate} />
              <BulletinCard onInspect={() => onNavigate('gazette')} />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
