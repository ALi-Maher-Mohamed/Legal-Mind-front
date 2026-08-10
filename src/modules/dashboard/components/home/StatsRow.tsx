'use client';

import { FileText, MessageSquareText, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useDeskStats } from '../../hooks/useDeskStats';
import StatCard from './StatCard';

function formatCount(n: number) {
  return n.toLocaleString('ar-EG');
}

export default function StatsRow() {
  const { t } = useLanguage();
  const { analyzedTotal, conversationsTotal, draftsTotal, isLoading } =
    useDeskStats();

  const stats = [
    {
      label: t.dashboard.stat1Title,
      value: isLoading ? '…' : formatCount(analyzedTotal),
      change: isLoading
        ? 'جاري التحديث…'
        : analyzedTotal === 0
          ? 'لا توجد عقود محلّلة بعد'
          : analyzedTotal === 1
            ? 'عقد محلّل واحد'
            : `${formatCount(analyzedTotal)} عقود محلّلة`,
      icon: <FileText className="h-5 w-5" strokeWidth={2.25} />,
    },
    {
      label: t.dashboard.stat2Title,
      value: isLoading ? '…' : formatCount(conversationsTotal),
      change: isLoading
        ? 'جاري التحديث…'
        : conversationsTotal === 0
          ? 'لا محادثات نشطة'
          : conversationsTotal === 1
            ? 'محادثة استشارية نشطة'
            : `${formatCount(conversationsTotal)} محادثات نشطة`,
      icon: <MessageSquareText className="h-5 w-5" strokeWidth={2.25} />,
    },
    {
      label: t.dashboard.stat3Title,
      value: isLoading ? '…' : formatCount(draftsTotal),
      change: isLoading
        ? 'جاري التحديث…'
        : draftsTotal === 0
          ? 'لا طلبات صياغة بعد'
          : draftsTotal === 1
            ? 'طلب صياغة واحد'
            : `${formatCount(draftsTotal)} طلبات صياغة`,
      icon: <BookOpen className="h-5 w-5" strokeWidth={2.25} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} loading={isLoading} />
      ))}
    </div>
  );
}
