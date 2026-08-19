import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import { extractListWithPagination } from '@/lib/api/listPagination';
import { sessionStore } from '@/lib/api/session';
import type {
  CreateGenerateResponse,
  GenerateJob,
  GenerateJobListItem,
  GenerateProgressLogsResponse,
  GenerateStreamEvent,
  ValidateGenerateResponse,
} from '@/types/generate.types';

const POLL_MS = 1800;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

function unwrapGenerateData<T>(response: unknown): T {
  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    (response as { data: unknown }).data !== undefined &&
    (response as { data: unknown }).data !== null
  ) {
    return (response as { data: T }).data;
  }
  return response as T;
}

function pickMarkdown(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

type StreamHandlers = {
  onEvent: (event: GenerateStreamEvent) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
};

function parseSseChunk(chunk: string, onEvent: (event: GenerateStreamEvent) => void) {
  const blocks = chunk.split(/\n\n/);
  for (const block of blocks) {
    const dataLines = block
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim());

    if (dataLines.length === 0) continue;

    try {
      const payload = JSON.parse(dataLines.join('\n')) as GenerateStreamEvent;
      if (payload && typeof payload === 'object') onEvent(payload);
    } catch {
      // ignore non-JSON keep-alives
    }
  }
}

function applyStreamEventToJob(jobId: string, event: GenerateStreamEvent): GenerateJob {
  return {
    jobId,
    status: event.status || 'processing',
    progress: typeof event.progress === 'number' ? event.progress : undefined,
    currentStage: event.currentStage || event.message || undefined,
    currentStep: event.currentStep || event.step || undefined,
    error: event.error,
  };
}

export function resolveContractMarkdown(job: GenerateJob): string {
  const nested = unwrapGenerateData<GenerateJob>(job);
  const result = nested.result;
  const generated =
    pickMarkdown(result?.contractMarkdown) ||
    pickMarkdown((result as { contract_markdown?: string } | undefined)?.contract_markdown);
  const edited = pickMarkdown(result?.editedMarkdown);

  // Ignore short stub edits that would overwrite a full generated contract.
  if (edited.length > 300) return edited;
  return generated || edited;
}

export function resolveContractTitle(job: GenerateJob, fallback: string): string {
  const nested = unwrapGenerateData<GenerateJob>(job);
  const jobDesc = nested.result?.contractSpec?.job_description?.trim();
  if (jobDesc) return `عقد عمل — ${jobDesc}`;
  if (nested.contractType === 'employment') return 'عقد عمل';
  if (nested.contractType) return `عقد ${nested.contractType}`;
  return fallback;
}

export const generateService = {
  async createJob(prompt: string): Promise<CreateGenerateResponse> {
    const response = await api.post<unknown>(
      '/api/v1/generate',
      { json: { prompt: prompt.trim() } },
      { auth: true },
    );
    return unwrapGenerateData<CreateGenerateResponse>(response);
  },

  async listJobsPage(
    params: { page?: number; limit?: number } = {},
  ): Promise<{
    jobs: GenerateJobListItem[];
    total: number;
    page: number;
    pages: number;
    limit: number;
  }> {
    const query = new URLSearchParams();
    query.set('page', String(params.page ?? 1));
    query.set('limit', String(params.limit ?? 20));
    const response = await api.get<unknown>(
      `/api/v1/generate?${query.toString()}`,
      { auth: true },
    );
    const { items, pagination } =
      extractListWithPagination<GenerateJobListItem>(response);
    return {
      jobs: items,
      total: pagination.total,
      page: pagination.page,
      pages: pagination.pages,
      limit: pagination.limit,
    };
  },

  async listJobs(params: { page?: number; limit?: number } = {}): Promise<GenerateJobListItem[]> {
    const { jobs } = await generateService.listJobsPage(params);
    return jobs;
  },

  /** pagination.total from GET /api/v1/generate */
  async countJobs(): Promise<number> {
    const result = await generateService.listJobsPage({ page: 1, limit: 1 });
    return result.total;
  },

  async getJob(jobId: string): Promise<GenerateJob> {
    const response = await api.get<unknown>(`/api/v1/generate/${jobId}`, { auth: true });
    return unwrapGenerateData<GenerateJob>(response);
  },

  async updateContract(jobId: string, editedMarkdown: string): Promise<string> {
    const response = await api.put<{ message?: string }>(
      `/api/v1/generate/${jobId}`,
      { json: { editedMarkdown } },
      { auth: true },
    );
    return response?.message || 'تم حفظ التعديلات';
  },

  async regenerate(jobId: string, instructions: string): Promise<GenerateJob | CreateGenerateResponse> {
    const response = await api.post<unknown>(
      `/api/v1/generate/${jobId}/regenerate`,
      { json: { instructions: instructions.trim() } },
      { auth: true },
    );
    return unwrapGenerateData<GenerateJob | CreateGenerateResponse>(response);
  },

  async validate(jobId: string): Promise<ValidateGenerateResponse> {
    const response = await api.post<unknown>(
      `/api/v1/generate/${jobId}/validate`,
      undefined,
      { auth: true },
    );
    return unwrapGenerateData<ValidateGenerateResponse>(response);
  },

  async cancelJob(jobId: string): Promise<string> {
    const response = await api.post<{ message?: string }>(
      `/api/v1/generate/${jobId}/cancel`,
      undefined,
      { auth: true },
    );
    return response?.message || 'تم إلغاء التوليد';
  },

  async deleteJob(jobId: string): Promise<void> {
    await api.delete(`/api/v1/generate/${jobId}`, { auth: true });
  },

  async getProgress(jobId: string): Promise<GenerateProgressLogsResponse> {
    const raw = await api.get<unknown>(
      `/api/v1/generate/${jobId}/progress`,
      { auth: true },
    );
    const data = unwrapGenerateData<GenerateProgressLogsResponse | GenerateStreamEvent[]>(raw);
    if (Array.isArray(data)) {
      return { jobId, logs: data, totalLogs: data.length };
    }
    if (data && typeof data === 'object') {
      const logs = Array.isArray(data.logs) ? data.logs : [];
      return {
        jobId: data.jobId || jobId,
        logs,
        totalLogs: data.totalLogs ?? logs.length,
      };
    }
    return { jobId, logs: [], totalLogs: 0 };
  },

  async downloadContract(jobId: string, fallbackName = 'contract.md'): Promise<void> {
    const { blob, fileName } = await api.download(`/api/v1/generate/${jobId}/download`, {
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

  async streamProgress(jobId: string, handlers: StreamHandlers): Promise<void> {
    const token = sessionStore.getAccessToken();
    const response = await fetch(`${env.apiBaseUrl}/api/v1/generate/${jobId}/stream`, {
      method: 'GET',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: handlers.signal,
    });

    if (!response.ok || !response.body) {
      throw new Error('تعذّر فتح بث تقدم التوليد');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split(/\n\n/);
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          parseSseChunk(part, handlers.onEvent);
        }
      }

      if (buffer.trim()) {
        parseSseChunk(buffer, handlers.onEvent);
      }
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') return;
      handlers.onError?.(error instanceof Error ? error : new Error('انقطع بث التقدم'));
      throw error;
    }
  },

  async waitForCompletion(
    jobId: string,
    options?: {
      onProgress?: (job: GenerateJob) => void;
      signal?: AbortSignal;
      preferStream?: boolean;
    },
  ): Promise<GenerateJob> {
    const preferStream = options?.preferStream !== false;

    if (preferStream) {
      try {
        // Seed UI from stored progress logs when available.
        try {
          const progress = await this.getProgress(jobId);
          const last = progress.logs[progress.logs.length - 1];
          if (last) {
            options?.onProgress?.(applyStreamEventToJob(jobId, last));
          }
        } catch {
          // optional
        }

        let terminalStatus: string | null = null;

        await this.streamProgress(jobId, {
          signal: options?.signal,
          onEvent: (event) => {
            const partial = applyStreamEventToJob(jobId, event);
            options?.onProgress?.(partial);
            const status = (event.status || '').toLowerCase();
            if (status === 'completed' || status === 'failed' || status === 'cancelled') {
              terminalStatus = status;
            }
            if (event.phase === 'done' || event.step === 'error') {
              terminalStatus = event.step === 'error' ? 'failed' : terminalStatus || 'completed';
            }
          },
        });

        if (options?.signal?.aborted) {
          throw new Error('تم إلغاء انتظار التوليد');
        }

        const afterStream = await this.getJob(jobId);
        options?.onProgress?.(afterStream);

        if (afterStream.status === 'completed' || terminalStatus === 'completed') {
          if (afterStream.status === 'completed') return afterStream;
        }
        if (afterStream.status === 'failed' || terminalStatus === 'failed') {
          throw new Error(afterStream.error || 'فشل توليد العقد');
        }
        if (
          afterStream.status === 'cancelled' ||
          terminalStatus === 'cancelled' ||
          String(afterStream.status).toLowerCase() === 'canceled'
        ) {
          throw new Error('تم إلغاء التوليد');
        }

        // Stream closed early while still processing — fall through to polling.
      } catch (error) {
        if (options?.signal?.aborted) {
          throw new Error('تم إلغاء انتظار التوليد');
        }
        if (error instanceof Error && error.message === 'تم إلغاء التوليد') {
          throw error;
        }
        if (error instanceof Error && error.message.startsWith('فشل توليد')) {
          throw error;
        }
        // SSE unavailable — continue with polling.
      }
    }

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
      if (
        job.status === 'cancelled' ||
        String(job.status).toLowerCase() === 'canceled'
      ) {
        throw new Error('تم إلغاء التوليد');
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
