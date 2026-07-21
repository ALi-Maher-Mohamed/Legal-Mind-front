import type { GazetteDocument } from '@/types/gazette.types';

/** Simulated AI audit payload applied after "Run Audit" */
export function buildMockAnalysis(doc: GazetteDocument): Partial<GazetteDocument> {
  return {
    status: 'Analysis Complete',
    summary: `تم تحليل المستند «${doc.name}» وفهرسة بنوده الأساسية للمراجعة.`,
    clauses: [
      {
        id: `${doc.id}-cl-1`,
        type: 'Confidentiality',
        title: 'بند السرية المستخلص',
        text: 'التزامات سرية معيارية تم رصدها أثناء المسح الأولي.',
        confidence: 88,
      },
    ],
    risks: [
      {
        id: `${doc.id}-rk-1`,
        level: 'medium',
        description: 'يتطلب مراجعة يدوية لبعض الصياغات العامة',
        suggestion: 'تحديد نطاق السرية والمدد الزمنية بشكل أدق.',
      },
    ],
    timeline: [
      {
        id: `${doc.id}-tm-1`,
        date: 'عند التوقيع',
        party: 'كلا الطرفين',
        description: 'بدء سريان الالتزامات التعاقدية',
      },
    ],
    parties: [
      {
        id: `${doc.id}-pt-1`,
        name: 'طرف أول',
        role: 'العميل',
        rights: 'حقوق تعاقدية عامة',
        obligations: 'الوفاء بالالتزامات المالية',
      },
    ],
  };
}
