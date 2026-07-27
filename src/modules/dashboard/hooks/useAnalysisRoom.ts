'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { analyzeService } from '@/services/analyze.service';
import type { AnalysisDocument, UploadPayload } from '@/types/analysis.types';
import {
  mapJobDetailToDocument,
  mapListItemToDocument,
  stageLabel,
  stepProgress,
} from '../lib/analyzeMappers';
import { filterAnalysisDocs } from '../lib/filterAnalysisDocs';
import { analysisCopy as c } from '../data/analysisCopy';

const POLL_MS = 2000;

export function useAnalysisRoom() {
  const [documents, setDocuments] = useState<AnalysisDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<AnalysisDocument | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isOpeningAudit, setIsOpeningAudit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AnalysisDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pollTimers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const stopPolling = useCallback((jobId: string) => {
    const timer = pollTimers.current.get(jobId);
    if (timer) {
      clearInterval(timer);
      pollTimers.current.delete(jobId);
    }
  }, []);

  const stopAllPolling = useCallback(() => {
    pollTimers.current.forEach((timer) => clearInterval(timer));
    pollTimers.current.clear();
  }, []);

  const applyJobUpdate = useCallback((jobId: string, updater: (doc: AnalysisDocument) => AnalysisDocument) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === jobId ? updater(doc) : doc)));
    setActiveDoc((prev) => (prev?.id === jobId ? updater(prev) : prev));
  }, []);

  const pollJob = useCallback(
    (jobId: string) => {
      if (pollTimers.current.has(jobId)) return;

      const timer = setInterval(async () => {
        try {
          const detail = await analyzeService.getJob(jobId);
          applyJobUpdate(jobId, (prev) => mapJobDetailToDocument(detail, prev));

          if (detail.status === 'processing') {
            setAnalyzingId(jobId);
          }

          if (detail.status === 'completed' || detail.status === 'failed') {
            stopPolling(jobId);
            setAnalyzingId((current) => (current === jobId ? null : current));
            if (detail.status === 'completed') {
              toastApiSuccess(c.analysisCompleteToast);
            }
            if (detail.status === 'failed') {
              toastApiError(detail.error || c.analysisFailedToast);
            }
          }
        } catch (error) {
          stopPolling(jobId);
          setAnalyzingId((current) => (current === jobId ? null : current));
          toastApiError(error, c.analysisPollError);
        }
      }, POLL_MS);

      pollTimers.current.set(jobId, timer);
    },
    [applyJobUpdate, stopPolling],
  );

  const loadJobs = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const jobs = await analyzeService.listJobs();
      let mapped = jobs.map(mapListItemToDocument);

      const failedIds = mapped.filter((doc) => doc.status === 'failed').map((doc) => doc.id);
      if (failedIds.length > 0) {
        const details = await Promise.allSettled(
          failedIds.map((id) => analyzeService.getJob(id)),
        );
        details.forEach((result) => {
          if (result.status !== 'fulfilled') return;
          mapped = mapped.map((doc) =>
            doc.id === result.value.jobId ? mapJobDetailToDocument(result.value, doc) : doc,
          );
        });
      }

      setDocuments(mapped);

      mapped
        .filter((doc) => doc.status === 'processing')
        .forEach((doc) => {
          setAnalyzingId(doc.id);
          pollJob(doc.id);
        });
    } catch (error) {
      toastApiError(error, c.listError);
    } finally {
      setIsLoadingList(false);
    }
  }, [pollJob]);

  useEffect(() => {
    void loadJobs();
    return () => stopAllPolling();
  }, [loadJobs, stopAllPolling]);

  const filteredDocs = useMemo(
    () => filterAnalysisDocs(documents, searchQuery, filterType),
    [documents, searchQuery, filterType],
  );

  const uploadDocument = useCallback(async (payload: UploadPayload) => {
    try {
      const uploaded = await analyzeService.uploadContract(payload.file);
      const doc = mapListItemToDocument(uploaded);
      setDocuments((prev) => [doc, ...prev.filter((item) => item.id !== doc.id)]);
      toastApiSuccess(c.uploadSuccess);
    } catch (error) {
      toastApiError(error, c.uploadError);
      throw error;
    }
  }, []);

  const runAudit = useCallback(
    async (docId: string) => {
      setAnalyzingId(docId);
      try {
        const started = await analyzeService.startAnalysis(docId);
        applyJobUpdate(docId, (prev) => ({
          ...prev,
          status: started.status,
          currentStage: stageLabel('0/7'),
          currentStep: '0/7',
          progress: stepProgress('0/7') ?? 0,
          error: undefined,
          tags: ['جاري التحليل'],
        }));
        toastApiSuccess(c.startSuccess);

        try {
          const detail = await analyzeService.getJob(docId);
          applyJobUpdate(docId, (prev) => mapJobDetailToDocument(detail, prev));
        } catch {
          // polling will recover
        }

        pollJob(docId);
      } catch (error) {
        setAnalyzingId(null);
        toastApiError(error, c.startError);
      }
    },
    [applyJobUpdate, pollJob],
  );

  const openAudit = useCallback(async (doc: AnalysisDocument) => {
    if (doc.status !== 'completed') return;

    setActiveDoc(doc);
    setHighlightId(null);

    if (doc.result) {
      setIsOpeningAudit(false);
      return;
    }

    setIsOpeningAudit(true);
    try {
      const detail = await analyzeService.getJob(doc.id);
      const mapped = mapJobDetailToDocument(detail, doc);
      applyJobUpdate(doc.id, () => mapped);
      setActiveDoc(mapped);
    } catch (error) {
      toastApiError(error, c.openError);
      setActiveDoc(null);
    } finally {
      setIsOpeningAudit(false);
    }
  }, [applyJobUpdate]);

  const closeAudit = useCallback(() => {
    setActiveDoc(null);
    setHighlightId(null);
    setIsOpeningAudit(false);
  }, []);

  const downloadReport = useCallback(async (doc: AnalysisDocument) => {
    try {
      const base = doc.name.replace(/\.[^/.]+$/, '');
      await analyzeService.downloadReport(doc.id, `report_${base}.md`);
      toastApiSuccess(c.downloadSuccess);
    } catch (error) {
      toastApiError(error, c.downloadError);
    }
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await analyzeService.deleteJob(deleteTarget.id);
      stopPolling(deleteTarget.id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== deleteTarget.id));
      if (activeDoc?.id === deleteTarget.id) {
        setActiveDoc(null);
      }
      toastApiSuccess(c.deleteSuccess);
      setDeleteTarget(null);
    } catch (error) {
      toastApiError(error, c.deleteError);
    } finally {
      setIsDeleting(false);
    }
  }, [activeDoc?.id, deleteTarget, stopPolling]);

  return {
    documents,
    filteredDocs,
    activeDoc,
    isListView,
    setIsListView,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    analyzingId,
    highlightId,
    setHighlightId,
    isLoadingList,
    isOpeningAudit,
    deleteTarget,
    isDeleting,
    uploadDocument,
    runAudit,
    openAudit,
    closeAudit,
    downloadReport,
    requestDelete: setDeleteTarget,
    cancelDelete: () => {
      if (!isDeleting) setDeleteTarget(null);
    },
    confirmDelete,
    refreshList: loadJobs,
  };
}
