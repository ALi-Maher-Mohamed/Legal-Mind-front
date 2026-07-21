export type DashboardView =
  | 'dashboard'
  | 'consultation'
  | 'analysis'
  | 'drafter'
  | 'gazette'
  | 'settings';

export type LegalDocumentStatus = 'Analysis Complete' | 'Pending Review';

export type LegalDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: LegalDocumentStatus;
  dateUploaded: string;
};

export type DeskActivity = {
  id: number;
  type: 'audit' | 'chat' | 'draft';
  title: string;
  desc: string;
  time: string;
  date: string;
  detail: string;
};

export type DeskObligation = {
  day: number;
  title: string;
  level: 'high' | 'medium';
  desc: string;
};
