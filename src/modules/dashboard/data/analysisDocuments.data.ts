import type { AnalysisDocument } from '@/types/analysis.types';
import { APEX_ANALYSIS } from './apexAnalysis.data';

export const ANALYSIS_DOCUMENTS: AnalysisDocument[] = [
  {
    id: 'doc-1',
    name: 'Apex_NDA_Final.pdf',
    type: 'NDA',
    size: '1.2 MB',
    status: 'Analysis Complete',
    dateUploaded: '١٣ يوليو',
    tags: ['سرية', 'اندماج', 'ديلاوير'],
    content: 'اتفاقية عدم إفصاح بين الأطراف الموقعين.',
    ...APEX_ANALYSIS,
  },
  {
    id: 'doc-2',
    name: 'Employment_Agreement_v3.docx',
    type: 'Employment',
    size: '840 KB',
    status: 'Pending Review',
    dateUploaded: '١٢ يوليو',
    tags: ['عمل', 'امتثال'],
  },
  {
    id: 'doc-3',
    name: 'Lease_Renewal_2026.pdf',
    type: 'Lease',
    size: '2.1 MB',
    status: 'Analysis Complete',
    dateUploaded: '١٠ يوليو',
    tags: ['إيجار', 'تجديد'],
    summary: 'عقد تجديد إيجار إداري لمدة ثلاث سنوات مع مهلة إخطار ٦٠ يوماً.',
    clauses: [],
    risks: [
      {
        id: 'rk-l1',
        level: 'medium',
        description: 'مهلة الإخطار قصيرة نسبياً قبل التجديد التلقائي',
        suggestion: 'تمديد مهلة الإخطار إلى ٩٠ يوماً على الأقل.',
      },
    ],
    timeline: [
      {
        id: 'tm-l1',
        date: '٢٢ يوليو',
        party: 'المستأجر',
        description: 'آخر موعد لإخطار عدم التجديد',
      },
    ],
    parties: [],
  },
];
