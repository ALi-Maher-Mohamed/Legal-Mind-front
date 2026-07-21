export type ClauseType =
  | 'Confidentiality'
  | 'IP Assignment'
  | 'Governing Law'
  | 'Indemnification'
  | string;

export type ExtractedClause = {
  id: string;
  type: ClauseType;
  title: string;
  text: string;
  confidence: number;
};

export type RiskLevel = 'high' | 'medium' | 'low';

export type RiskFactor = {
  id: string;
  level: RiskLevel;
  description: string;
  suggestion: string;
};

export type ObligationMilestone = {
  id: string;
  date: string;
  party: string;
  description: string;
};

export type DocumentParty = {
  id: string;
  name: string;
  role: string;
  rights: string;
  obligations: string;
};

export type GazetteDocStatus = 'Analysis Complete' | 'Pending Review';

export type GazetteDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: GazetteDocStatus;
  dateUploaded: string;
  tags: string[];
  content?: string;
  summary?: string;
  clauses?: ExtractedClause[];
  risks?: RiskFactor[];
  timeline?: ObligationMilestone[];
  parties?: DocumentParty[];
};

export type AuditTab = 'summary' | 'clauses' | 'risks' | 'timeline' | 'parties';

export type UploadPayload = {
  name: string;
  size: string;
  content: string;
  type: string;
};
