import type { Locale } from '@/config/translations';
import type { DeskObligation } from '@/types/dashboard.types';

const EN: DeskObligation[] = [
  {
    day: 14,
    title: 'Apex Discovery Filing Due',
    level: 'high',
    desc: 'Settle outstanding responses for exhibit C deliveries.',
  },
  {
    day: 22,
    title: 'Lease Contract Renewal Notice',
    level: 'medium',
    desc: 'Prior 60-day notification threshold for office rental terms.',
  },
  {
    day: 28,
    title: 'Cairo Arbitral Hearing Prep',
    level: 'high',
    desc: 'Assemble indexed brief documents for counsel review.',
  },
];

const AR: DeskObligation[] = [
  {
    day: 14,
    title: 'موعد تقديم مستندات الإفصاح لشركة Apex',
    level: 'high',
    desc: 'استكمال وتسوية الردود القانونية المعلقة لتسليم المعروض ج.',
  },
  {
    day: 22,
    title: 'إخطار تجديد عقد إيجار المقر الإداري',
    level: 'medium',
    desc: 'مراجعة مهلة الـ ٦٠ يوماً السابقة للإخطار لشروط الإيجار.',
  },
  {
    day: 28,
    title: 'التحضير لجلسة تحكيم القاهرة الكبرى',
    level: 'high',
    desc: 'تجميع وفهرسة مستندات المذكرة التفصيلية للمراجعة النهائية.',
  },
];

export function getDeskObligations(locale: Locale): DeskObligation[] {
  return locale === 'ar' ? AR : EN;
}
