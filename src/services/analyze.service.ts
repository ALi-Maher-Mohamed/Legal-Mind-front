import { api } from '@/lib/api/client';
import type {
  AnalyzeJobDetail,
  AnalyzeJobListItem,
  ProgressLogsResponse,
  StartAnalysisResponse,
  UploadJobResponse,
} from '@/types/analysis.types';

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

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName || fallbackName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  },
};
