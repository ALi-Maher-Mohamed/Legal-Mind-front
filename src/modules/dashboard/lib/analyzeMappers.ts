import type {
  AnalysisDocument,
  AnalyzeJobDetail,
  AnalyzeJobListItem,
  JobStatus,
} from '@/types/analysis.types';

export const STAGE_NAMES: Record<string, string> = {
  '0/7': 'تحميل الملف من التخزين...',
  '1/7': 'استخراج النص من العقد...',
  '2/7': 'تنقية النص والتحقق من صحته...',
  '3/7': 'تقسيم العقد إلى بنود...',
  '4/7': 'المطابقة مع قانون العمل المصري...',
  '5/7': 'تقييم الامتثال وحساب النتيجة...',
  '6/7': 'إعداد التقرير القانوني...',
  '7/7': 'اكتمل التحليل — التقرير جاهز',
};

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatJobDate(iso?: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function inferDocType(fileName: string, fileType?: string): string {
  const lower = fileName.toLowerCase();
  if (lower.includes('nda')) return 'NDA';
  if (lower.endsWith('.docx') || lower.endsWith('.doc') || fileType?.includes('word')) {
    return 'Employment';
  }
  if (lower.endsWith('.pdf')) return 'Contract';
  return 'Contract';
}

function statusTags(status: JobStatus): string[] {
  switch (status) {
    case 'queued':
      return ['بانتظار البدء'];
    case 'processing':
      return ['جاري التحليل'];
    case 'completed':
      return ['مكتمل'];
    case 'failed':
      return ['فشل'];
    default:
      return [];
  }
}

export function mapListItemToDocument(job: AnalyzeJobListItem): AnalysisDocument {
  return {
    id: job.jobId,
    name: job.fileName,
    type: inferDocType(job.fileName, job.fileType),
    size: formatFileSize(job.fileSize),
    status: job.status,
    dateUploaded: formatJobDate(job.createdAt),
    tags: statusTags(job.status),
    fileType: job.fileType,
    contractUrl: job.contractUrl,
    reportUrl: job.reportUrl,
  };
}

export function mapJobDetailToDocument(
  job: AnalyzeJobDetail,
  previous?: AnalysisDocument,
): AnalysisDocument {
  const base = mapListItemToDocument(job);
  return {
    ...previous,
    ...base,
    error: job.error,
    currentStage: job.currentStage ?? previous?.currentStage,
    currentStep: job.currentStep ?? previous?.currentStep,
    progress: job.progress ?? previous?.progress,
    result: job.result ?? previous?.result,
    contractUrl: job.files?.contract ?? job.contractUrl ?? previous?.contractUrl,
    reportUrl: job.files?.report ?? job.reportUrl ?? previous?.reportUrl,
    tags: statusTags(job.status),
  };
}

export function stepProgress(step?: string): number | undefined {
  if (!step || step === 'error' || step === 'done') return undefined;
  const num = parseInt(step.split('/')[0] ?? '', 10);
  if (Number.isNaN(num)) return undefined;
  return Math.round((num / 7) * 100);
}

export function stageLabel(step?: string, fallback?: string): string | undefined {
  if (!step) return fallback;
  return STAGE_NAMES[step] ?? fallback;
}
