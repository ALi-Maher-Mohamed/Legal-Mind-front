'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { getDeskActivities } from '../../data/activities.data';
import DashPanel from '../ui/DashPanel';
import ActivityItem from './ActivityItem';

export default function ActivityFeed() {
  const { t, locale } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);
  const activities = useMemo(() => getDeskActivities(locale), [locale]);

  return (
    <DashPanel>
      <h2 className="mb-6 border-b border-brand/15 pb-4 text-lg font-bold text-foreground dark:border-white/10">
        {t.dashboard.activityLog}
      </h2>
      <div className="relative ms-3 space-y-8 border-s-2 border-brand/25 ps-6">
        {activities.map((act, index) => (
          <ActivityItem
            key={act.id}
            activity={act}
            expanded={selected === index}
            expandLabel={t.dashboard.expand}
            collapseLabel={t.dashboard.collapse}
            onToggle={() => setSelected(selected === index ? null : index)}
          />
        ))}
      </div>
    </DashPanel>
  );
}
