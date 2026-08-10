export type DashboardView =
  | 'dashboard'
  | 'consultation'
  | 'analysis'
  | 'drafter'
  | 'gazette'
  | 'profile';

export type LegalDocumentStatus = 'Analysis Complete' | 'Pending Review';

export type LegalDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: LegalDocumentStatus;
  dateUploaded: string;
};

export type DashboardActivityType =
  | 'conversation'
  | 'generation'
  | 'comment'
  | 'blog'
  | 'analysis'
  | 'bookmark'
  | (string & {});

export type DashboardActivityRecord = {
  id?: string;
  type: DashboardActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export type DashboardActivityDay = {
  date: string;
  label: string;
  records: DashboardActivityRecord[];
};

export type DashboardActivityPeriod = {
  start: string;
  end: string;
};

export type DashboardActivityPagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type DashboardActivityResponse = {
  period: DashboardActivityPeriod;
  daily: DashboardActivityDay[];
  pagination: DashboardActivityPagination;
};

export type DashboardActivityParams = {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};
