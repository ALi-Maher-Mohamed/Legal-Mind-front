import { FileText, Scale, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { LegalDocument } from '@/types/dashboard.types';
import StatCard from './StatCard';

type Props = { documents: LegalDocument[] };

export default function StatsRow({ documents }: Props) {
  const { t } = useLanguage();
  const analyzed = documents.filter((d) => d.status === 'Analysis Complete').length;

  const stats = [
    {
      label: t.dashboard.stat1Title,
      value: analyzed,
      change: '+١٤٪ مقارنة بالشهر السابق',
      icon: <FileText className="h-5 w-5" strokeWidth={2.25} />,
    },
    {
      label: t.dashboard.stat2Title,
      value: documents.length,
      change: '+٢ تم تسجيلها اليوم',
      icon: <Scale className="h-5 w-5" strokeWidth={2.25} />,
    },
    {
      label: t.dashboard.stat3Title,
      value: 8,
      change: 'دقة صياغية عالية',
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
