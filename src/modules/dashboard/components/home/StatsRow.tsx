import { FileText, Scale, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { LegalDocument } from '@/types/dashboard.types';
import StatCard from './StatCard';

type Props = { documents: LegalDocument[] };

export default function StatsRow({ documents }: Props) {
  const { t, locale } = useLanguage();
  const analyzed = documents.filter((d) => d.status === 'Analysis Complete').length;

  const stats = [
    {
      label: t.dashboard.stat1Title,
      value: analyzed,
      change: locale === 'ar' ? '+١٤٪ مقارنة بالشهر السابق' : '+14% vs prior mo',
      icon: <FileText className="h-5 w-5" strokeWidth={2.25} />,
    },
    {
      label: t.dashboard.stat2Title,
      value: documents.length,
      change: locale === 'ar' ? '+٢ تم تسجيلها اليوم' : '+2 registered today',
      icon: <Scale className="h-5 w-5" strokeWidth={2.25} />,
    },
    {
      label: t.dashboard.stat3Title,
      value: 8,
      change: locale === 'ar' ? 'دقة صياغية عالية' : 'Uncompromising precision',
      icon: <BookOpen className="h-5 w-5" strokeWidth={2.25} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
