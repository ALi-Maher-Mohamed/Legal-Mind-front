import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import { extractListWithPagination } from '@/lib/api/listPagination';
import { sessionStore } from '@/lib/api/session';
import type {
  AnalyzeJobDetail,
  AnalyzeJobListItem,
  ProgressLog,
  ProgressLogsResponse,
  StartAnalysisResponse,
  UploadJobResponse,
} from '@/types/analysis.types';

type StreamHandlers = {
  onEvent: (event: ProgressLog) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
};

/**
 * Contract analyze endpoints use { success, message, data } envelopes
 * (see FRONTEND_API_INTEGRATION.md §7.8).
 */
function unwrapContractData<T>(response: unknown): T {
  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    (response as { data: unknown }).data !== undefined
  ) {
    return (response as { data: T }).data;
  }
  return response as T;
}

function parseSseChunk(chunk: string, onEvent: (event: ProgressLog) => void) {
  const blocks = chunk.split(/\n\n/);
  for (const block of blocks) {
    const dataLines = block
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim());

    if (dataLines.length === 0) continue;

    try {
      const payload = JSON.parse(dataLines.join('\n')) as ProgressLog;
      if (payload?.step) onEvent(payload);
    } catch {
      // ignore non-JSON keep-alives
    }
  }
}

export const analyzeService = {
  async listJobsPage(
    params: { page?: number; limit?: number } = {},
  ): Promise<{
    jobs: AnalyzeJobListItem[];
    total: number;
    page: number;
    pages: number;
    limit: number;
  }> {
    const query = new URLSearchParams();
    query.set('page', String(params.page ?? 1));
    query.set('limit', String(params.limit ?? 20));
    const response = await api.get<unknown>(
      `/api/v1/analyze?${query.toString()}`,
      { auth: true },
    );
    const { items, pagination } =
      extractListWithPagination<AnalyzeJobListItem>(response);
    return {
      jobs: items,
      total: pagination.total,
      page: pagination.page,
      pages: pagination.pages,
      limit: pagination.limit,
    };
  },

  async listJobs(params: { page?: number; limit?: number } = {}): Promise<AnalyzeJobListItem[]> {
    const { jobs } = await analyzeService.listJobsPage(params);
    return jobs;
  },

  /** pagination.total from GET /api/v1/analyze */
  async countJobs(): Promise<number> {
    const result = await analyzeService.listJobsPage({ page: 1, limit: 1 });
    return result.total;
  },

  async uploadContract(file: File): Promise<UploadJobResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<unknown>(
      '/api/v1/analyze',
      { formData },
      { auth: true },
    );
    return unwrapContractData<UploadJobResponse>(response);
  },

  async startAnalysis(jobId: string): Promise<StartAnalysisResponse> {
    const response = await api.post<unknown>(
      `/api/v1/analyze/${jobId}/start`,
      {},
      { auth: true },
    );
    return unwrapContractData<StartAnalysisResponse>(response);
  },

  async getJob(jobId: string): Promise<AnalyzeJobDetail> {
    const response = await api.get<unknown>(`/api/v1/analyze/${jobId}`, {
      auth: true,
    });
    return unwrapContractData<AnalyzeJobDetail>(response);
  },

  async getProgress(jobId: string): Promise<ProgressLogsResponse> {
    const response = await api.get<unknown>(`/api/v1/analyze/${jobId}/progress`, {
      auth: true,
    });
    const data = unwrapContractData<ProgressLogsResponse>(response);
    if (data && typeof data === 'object' && Array.isArray(data.logs)) {
      return {
        jobId: data.jobId || jobId,
        logs: data.logs,
        totalLogs: data.totalLogs ?? data.logs.length,
      };
    }
    return { jobId, logs: [], totalLogs: 0 };
  },

  async deleteJob(jobId: string): Promise<void> {
    await api.delete(`/api/v1/analyze/${jobId}`, { auth: true });
  },

  async downloadReport(jobId: string, fallbackName: string): Promise<void> {
    const { blob, fileName } = await api.download(
      `/api/v1/analyze/${jobId}/report/download`,
      { auth: true },
    );

    const resolvedName = (() => {
      if (fileName?.toLowerCase().endsWith('.pdf')) return fileName;
      if (blob.type.includes('pdf')) {
        const base = (fileName || fallbackName).replace(/\.[^/.]+$/, '');
        return `${base}.pdf`;
      }
      return fileName || fallbackName;
    })();

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
    const response = await fetch(`${env.apiBaseUrl}/api/v1/analyze/${jobId}/stream`, {
      method: 'GET',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: handlers.signal,
    });

    if (!response.ok || !response.body) {
      throw new Error('تعذّر فتح بث تقدم التحليل');
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
      handlers.onError?.(
        error instanceof Error ? error : new Error('انقطع بث التقدم'),
      );
      throw error;
    }
  },
};
