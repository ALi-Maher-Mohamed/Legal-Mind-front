import { api } from '@/lib/api/client';
import type {
  CreateGenerateResponse,
  GenerateJob,
  ValidateGenerateResponse,
} from '@/types/generate.types';

const POLL_MS = 1800;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

export function resolveContractMarkdown(job: GenerateJob): string {
  const generated = job.result?.contractMarkdown?.trim() || '';
  const edited = job.result?.editedMarkdown?.trim() || '';

  // Ignore short stub edits that would overwrite a full generated contract.
  if (edited.length > 300) return edited;
  return generated || edited;
}

export function resolveContractTitle(job: GenerateJob, fallback: string): string {
  const jobDesc = job.result?.contractSpec?.job_description?.trim();
  if (jobDesc) return `عقد عمل — ${jobDesc}`;
  if (job.contractType === 'employment') return 'عقد عمل';
  if (job.contractType) return `عقد ${job.contractType}`;
  return fallback;
}

export const generateService = {
  async createJob(prompt: string): Promise<CreateGenerateResponse> {
    const response = await api.post<CreateGenerateResponse>(
      '/api/generate',
      { json: { prompt: prompt.trim() } },
      { auth: true },
    );
    return response.data;
  },

  async getJob(jobId: string): Promise<GenerateJob> {
    const response = await api.get<GenerateJob>(`/api/generate/${jobId}`, { auth: true });
    return response.data;
  },

  async updateContract(jobId: string, editedMarkdown: string): Promise<string> {
    const response = await api.put<unknown>(
      `/api/generate/${jobId}`,
      { json: { editedMarkdown } },
      { auth: true },
    );
    return response.message;
  },

  async regenerate(jobId: string, instructions: string): Promise<GenerateJob | CreateGenerateResponse> {
    const response = await api.post<GenerateJob | CreateGenerateResponse>(
      `/api/generate/${jobId}/regenerate`,
      { json: { instructions: instructions.trim() } },
      { auth: true },
    );
    return response.data;
  },

  async validate(jobId: string): Promise<ValidateGenerateResponse> {
    const response = await api.post<ValidateGenerateResponse>(
      `/api/generate/${jobId}/validate`,
      undefined,
      { auth: true },
    );
    return response.data;
  },

  async downloadContract(jobId: string, fallbackName = 'contract.md'): Promise<void> {
    const { blob, fileName } = await api.download(`/api/generate/${jobId}/download`, {
      auth: true,
    });
    const resolvedName = fileName || fallbackName;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = resolvedName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  },

  async waitForCompletion(
    jobId: string,
    options?: {
      onProgress?: (job: GenerateJob) => void;
      signal?: AbortSignal;
    },
  ): Promise<GenerateJob> {
    const startedAt = Date.now();

    while (true) {
      if (options?.signal?.aborted) {
        throw new Error('تم إلغاء انتظار التوليد');
      }

      const job = await this.getJob(jobId);
      options?.onProgress?.(job);

      if (job.status === 'completed') return job;
      if (job.status === 'failed') {
        throw new Error(job.error || 'فشل توليد العقد');
      }

      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        throw new Error('انتهت مهلة انتظار التوليد');
      }

      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => resolve(), POLL_MS);
        options?.signal?.addEventListener(
          'abort',
          () => {
            clearTimeout(timer);
            reject(new Error('تم إلغاء انتظار التوليد'));
          },
          { once: true },
        );
      });
    }
  },
};
