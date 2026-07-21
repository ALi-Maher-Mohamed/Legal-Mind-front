'use client';

import { useState } from 'react';
import type { AuthUser } from '@/types/auth.types';
import type { DashboardView, LegalDocument } from '@/types/dashboard.types';
import DeskHeader from './DeskHeader';
import DeskEmptyState from './DeskEmptyState';
import StatsRow from './StatsRow';
import DocumentsStrip from './DocumentsStrip';
import ActivityFeed from './ActivityFeed';
import ObligationsCalendar from './ObligationsCalendar';
import BulletinCard from './BulletinCard';

type Props = {
  user: AuthUser;
  documents: LegalDocument[];
  onNavigate: (view: DashboardView) => void;
};

export default function DashboardHome({ user, documents, onNavigate }: Props) {
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div className="space-y-8">
      <DeskHeader
        user={user}
        showEmpty={showEmpty}
        onToggleEmpty={() => setShowEmpty((v) => !v)}
      />

      {showEmpty ? (
        <DeskEmptyState onEnterEvidence={() => onNavigate('analysis')} />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <StatsRow documents={documents} />
            <DocumentsStrip documents={documents} onOpenLibrary={() => onNavigate('analysis')} />
            <ActivityFeed />
          </div>
          <div className="space-y-8 lg:col-span-4">
            <ObligationsCalendar />
            <BulletinCard onInspect={() => onNavigate('gazette')} />
          </div>
        </div>
      )}
    </div>
  );
}
