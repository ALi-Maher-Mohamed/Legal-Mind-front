import type { LegalDocument } from '@/types/dashboard.types';

export const MOCK_DOCUMENTS: LegalDocument[] = [
  {
    id: 'doc-1',
    name: 'Apex_NDA_Final.pdf',
    type: 'NDA',
    size: '1.2 MB',
    status: 'Analysis Complete',
    dateUploaded: 'Jul 13',
  },
  {
    id: 'doc-2',
    name: 'Employment_Agreement_v3.docx',
    type: 'Contract',
    size: '840 KB',
    status: 'Pending Review',
    dateUploaded: 'Jul 12',
  },
  {
    id: 'doc-3',
    name: 'Lease_Renewal_2026.pdf',
    type: 'Lease',
    size: '2.1 MB',
    status: 'Analysis Complete',
    dateUploaded: 'Jul 10',
  },
];
