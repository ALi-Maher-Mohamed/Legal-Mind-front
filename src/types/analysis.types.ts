export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type ProgressPhase = 'start' | 'progress' | 'result' | 'done';

export type ProgressLog = {
  step: string;
  phase: ProgressPhase;
  message: string;
  timestamp: string;
};

export type ComplianceStatus =
  | 'compliant'
  | 'non_compliant'
  | 'partially_compliant'
  | 'missing';

export type RiskCategory = 'low' | 'medium' | 'high' | 'critical';

export type ClauseAnalysis = {
  clause_id: string;
  clause_text: string;
  compliance: {
    status: ComplianceStatus;
    confidence: 'high' | 'medium' | 'low';
    explanation: string;
  };
  legal_basis: Array<{
    law: string;
    article: string;
    text: string;
    relevance: 'direct' | 'indirect';
  }>;
  risk_assessment: {
    level: number;
    category: RiskCategory;
    description: string;
    potential_penalty?: string;
  };
  party_balance: {
    favored_party: 'employer' | 'employee' | 'neutral';
    score: number;
    explanation: string;
  };
  required_action: {
    action_needed: boolean;
    severity: 'info' | 'warning' | 'critical';
    suggested_fix: string;
    rationale: string;
  };
  comparison_to_standard: {
    standard_clause: string;
    deviation: 'none' | 'minor' | 'major';
    deviation_details: string;
  };
};

export type OverallScore = {
  overall_score: number;
  classification: 'excellent' | 'good' | 'needs_review' | 'high_risk' | 'critical';
  color: 'green' | 'yellow' | 'orange' | 'red';
  breakdown: {
    compliance: number;
    risk: number;
    completeness: number;
    balance: number;
  };
  mandatory_clauses: {
    present: number;
    missing: number;
    non_compliant: number;
  };
  summary: string;
  top_risks: string[];
  recommendations: string[];
};

export type AnalysisResult = {
  overall: OverallScore;
  clauses: ClauseAnalysis[];
  report_markdown: string;
  processed_at: string;
};

export type AnalyzeJobListItem = {
  jobId: string;
  status: JobStatus;
  fileName: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
  completedAt?: string;
  contractUrl?: string;
  reportUrl?: string;
};

export type AnalyzeJobDetail = AnalyzeJobListItem & {
  error?: string;
  result?: AnalysisResult;
  files?: {
    contract?: string;
    report?: string;
  };
  currentStage?: string;
  currentStep?: string;
  totalSteps?: string;
  progress?: number;
};

export type UploadJobResponse = {
  jobId: string;
  status: JobStatus;
  fileName: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
};

export type StartAnalysisResponse = {
  jobId: string;
  status: JobStatus;
};

export type ProgressLogsResponse = {
  jobId: string;
  logs: ProgressLog[];
  totalLogs: number;
};

/** UI document model for the analysis library + audit view */
export type AnalysisDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  status: JobStatus;
  dateUploaded: string;
  tags: string[];
  fileType?: string;
  contractUrl?: string;
  reportUrl?: string;
  error?: string;
  currentStage?: string;
  currentStep?: string;
  progress?: number;
  result?: AnalysisResult;
};

export type AuditTab =
  | 'summary'
  | 'clauses'
  | 'risks'
  | 'recommendations'
  | 'parties';

export type UploadPayload = {
  file: File;
};
