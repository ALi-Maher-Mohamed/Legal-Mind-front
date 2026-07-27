import { env } from '@/config/env';
import { api } from '@/lib/api/client';
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
  async listJobs(): Promise<AnalyzeJobListItem[]> {
    const response = await api.get<AnalyzeJobListItem[]>('/api/analyze', { auth: true });
    return response.data ?? [];
  },

  async uploadContract(file: File): Promise<UploadJobResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<UploadJobResponse>('/api/analyze', { formData }, { auth: true });
    return response.data;
  },

  async startAnalysis(jobId: string): Promise<StartAnalysisResponse> {
    const response = await api.post<StartAnalysisResponse>(
      `/api/analyze/${jobId}/start`,
      {},
      { auth: true },
    );
    return response.data;
  },

  async getJob(jobId: string): Promise<AnalyzeJobDetail> {
    const response = await api.get<AnalyzeJobDetail>(`/api/analyze/${jobId}`, { auth: true });
    return response.data;
  },

  async getProgress(jobId: string): Promise<ProgressLogsResponse> {
    const response = await api.get<ProgressLogsResponse>(`/api/analyze/${jobId}/progress`, {
      auth: true,
    });
    return response.data;
  },

  async deleteJob(jobId: string): Promise<void> {
    await api.delete<{ jobId: string }>(`/api/analyze/${jobId}`, { auth: true });
  },

  async downloadReport(jobId: string, fallbackName: string): Promise<void> {
    const { blob, fileName } = await api.download(`/api/analyze/${jobId}/report/download`, {
      auth: true,
    });

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
    const response = await fetch(`${env.apiBaseUrl}/api/analyze/${jobId}/stream`, {
      method: 'GET',
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
      handlers.onError?.(error instanceof Error ? error : new Error('انقطع بث التقدم'));
      throw error;
    }
  },
};
