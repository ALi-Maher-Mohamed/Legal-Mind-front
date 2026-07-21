import type { DeskObligation } from '@/types/dashboard.types';

const OBLIGATIONS: DeskObligation[] = [
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

export function getDeskObligations(): DeskObligation[] {
  return OBLIGATIONS;
}
