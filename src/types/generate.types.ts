export type GenerateJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type GenerateSeverity = 'info' | 'warning' | 'critical' | 'medium' | 'high' | 'low';

export type GenerateValidationIssue = {
  clause: string;
  status: string;
  explanation: string;
  suggestedFix: string;
  severity: string;
};

export type GenerateValidationResult = {
  valid: boolean;
  score: number;
  issues: GenerateValidationIssue[];
  compliantClauses: number;
  totalClauses: number;
};

export type GeneratePlaceholder = {
  field: string;
  label: string;
  required: boolean;
  filled: boolean;
};

export type GenerateResult = {
  contractSpec?: {
    contract_type?: string;
    job_description?: string;
    missing_fields?: Array<{ field: string; label: string; clause: string }>;
  };
  contractMarkdown?: string;
  editedMarkdown?: string;
  placeholders?: GeneratePlaceholder[];
  complianceCheck?: {
    compliant: boolean;
    warnings: string[];
    autoFixesApplied: number;
  };
  validationResult?: GenerateValidationResult | null;
  processed_at?: string;
};

export type GenerateJob = {
  jobId: string;
  status: GenerateJobStatus | string;
  language?: string;
  contractType?: string;
  createdAt?: string;
  completedAt?: string;
  currentStage?: string;
  currentStep?: string;
  totalSteps?: string;
  progress?: number;
  error?: string;
  result?: GenerateResult | null;
  files?: {
    report?: string;
  };
};

export type CreateGenerateResponse = {
  jobId: string;
  status: string;
  createdAt?: string;
};

export type ValidateGenerateResponse = {
  validationResult: GenerateValidationResult;
  report?: string;
};

export type GenerateProgressState = {
  progress: number;
  stage: string;
  step: string;
};
