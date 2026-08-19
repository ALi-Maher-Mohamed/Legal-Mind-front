'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import {
  generateService,
  resolveContractMarkdown,
  resolveContractTitle,
} from '@/services/generate.service';
import type {
  ContractTemplate,
  DraftOutputLang,
  DrafterViewMode,
  DraftVersion,
} from '@/types/drafter.types';
import type {
  GenerateJob,
  GenerateJobListItem,
  GenerateProgressState,
  GenerateValidationResult,
} from '@/types/generate.types';
import { drafterCopy as c } from '../data/drafterCopy';
import { compileTemplateDraft } from '../lib/compileDraft';
import { exportContractPdf } from '../lib/exportContractPdf';

const DESKTOP_MQ = '(min-width: 1024px)';

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_MQ);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_MQ).matches;
}

function getDesktopServerSnapshot() {
  return false;
}

const TODAY = new Date().toLocaleDateString('ar-EG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function buildPromptWithLanguage(prompt: string, language: DraftOutputLang): string {
  if (language === 'English') {
    return `${prompt.trim()}\n\nPlease generate the contract in English.`;
  }
  if (language === 'Bilingual') {
    return `${prompt.trim()}\n\nPlease generate the contract in bilingual Arabic and English.`;
  }
  return prompt.trim();
}

function toProgress(job: GenerateJob, fallbackStage: string): GenerateProgressState {
  return {
    progress: typeof job.progress === 'number' ? job.progress : 0,
    stage: job.currentStage || fallbackStage,
    step: job.currentStep || '',
  };
}

function sortJobsByDate(list: GenerateJobListItem[]): GenerateJobListItem[] {
  return [...list].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.completedAt || 0).getTime();
    const bTime = new Date(b.createdAt || b.completedAt || 0).getTime();
    return bTime - aTime;
  });
}

export function useDraftersStudio() {
  const [viewMode, setViewMode] = useState<DrafterViewMode>('library');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [descriptionPrompt, setDescriptionPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<DraftOutputLang>('Arabic');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftProgress, setDraftProgress] = useState<GenerateProgressState | null>(null);
  const [wizardValues, setWizardValues] = useState<Record<string, string>>({});
  const [editorTitle, setEditorTitle] = useState('مسودة اتفاقية');
  const [editorContent, setEditorContent] = useState('');
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot,
  );
  const [aiAssistOverride, setAiAssistOverride] = useState<boolean | null>(null);
  const [riskScannerOverride, setRiskScannerOverride] = useState<boolean | null>(null);
  const showAiAssist = aiAssistOverride ?? isDesktop;
  const showRiskScanner = riskScannerOverride ?? isDesktop;
  const [editorHistory, setEditorHistory] = useState<DraftVersion[]>([
    { v: 'v1.0.0', date: TODAY, content: '' },
  ]);
  const [activeVersion, setActiveVersion] = useState('v1.0.0');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [validation, setValidation] = useState<GenerateValidationResult | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [jobs, setJobs] = useState<GenerateJobListItem[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [jobPendingDelete, setJobPendingDelete] = useState<GenerateJobListItem | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const draftingJobIdRef = useRef<string | null>(null);

  const setShowAiAssist = useCallback<Dispatch<SetStateAction<boolean>>>(
    (value) => {
      setAiAssistOverride((prev) => {
        const current = prev ?? isDesktop;
        return typeof value === 'function' ? value(current) : value;
      });
    },
    [isDesktop],
  );

  const setShowRiskScanner = useCallback<Dispatch<SetStateAction<boolean>>>(
    (value) => {
      setRiskScannerOverride((prev) => {
        const current = prev ?? isDesktop;
        return typeof value === 'function' ? value(current) : value;
      });
    },
    [isDesktop],
  );

  const openWizard = useCallback((tmpl: ContractTemplate) => {
    setSelectedTemplate(tmpl);
    setWizardValues({});
    setViewMode('wizard');
  }, []);

  const openEditor = useCallback(
    (
      title: string,
      content: string,
      options?: {
        jobId?: string | null;
        validation?: GenerateValidationResult | null;
        reportUrl?: string | null;
      },
    ) => {
      setEditorTitle(title);
      setEditorContent(content);
      setEditorHistory([{ v: 'v1.0.0', date: TODAY, content }]);
      setActiveVersion('v1.0.0');
      setActiveJobId(options?.jobId ?? null);
      setValidation(options?.validation ?? null);
      setReportUrl(options?.reportUrl ?? null);
      setViewMode('editor');
    },
    [],
  );

  const refreshJobs = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const list = await generateService.listJobs();
      setJobs(sortJobsByDate(list));
    } catch (error) {
      toastApiError(error, c.jobsOpenFail);
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);

  const goLibrary = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    draftingJobIdRef.current = null;
    setIsDrafting(false);
    setDraftProgress(null);
    setViewMode('library');
    void refreshJobs();
  }, [refreshJobs]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialJobs() {
      try {
        const list = await generateService.listJobs();
        if (cancelled) return;
        setJobs(sortJobsByDate(list));
      } catch (error) {
        if (!cancelled) toastApiError(error, c.jobsOpenFail);
      } finally {
        if (!cancelled) setIsLoadingJobs(false);
      }
    }

    void loadInitialJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCompletedJob = useCallback(
    (job: GenerateJob) => {
      const content = resolveContractMarkdown(job);
      if (!content) {
        throw new Error('لا يوجد نص عقد لهذا الطلب');
      }
      const title = resolveContractTitle(job, `${c.customDraft}${c.draftSuffix}`);
      openEditor(title, content, {
        jobId: job.jobId,
        validation: job.result?.validationResult ?? null,
        reportUrl: job.files?.report ?? null,
      });
    },
    [openEditor],
  );

  const waitAndOpen = useCallback(
    async (jobId: string, controller: AbortController, fallbackStage: string) => {
      draftingJobIdRef.current = jobId;
      setActiveJobId(jobId);
      setIsDrafting(true);
      setDraftProgress({ progress: 0, stage: fallbackStage, step: '' });

      const completed = await generateService.waitForCompletion(jobId, {
        signal: controller.signal,
        onProgress: (job) => setDraftProgress(toProgress(job, fallbackStage)),
      });

      openCompletedJob(completed);
      toastApiSuccess(c.generateOk);
      void refreshJobs();
    },
    [openCompletedJob, refreshJobs],
  );

  const submitAiDraft = useCallback(async () => {
    if (!descriptionPrompt.trim() || isDrafting) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsDrafting(true);
    setDraftProgress({ progress: 0, stage: c.drafting, step: '' });

    try {
      const prompt = buildPromptWithLanguage(descriptionPrompt, selectedLanguage);
      const created = await generateService.createJob(prompt);
      await waitAndOpen(created.jobId, controller, c.drafting);
    } catch (error) {
      if (controller.signal.aborted) return;
      const message = error instanceof Error ? error.message : '';
      if (message === 'تم إلغاء التوليد' || message === 'تم إلغاء انتظار التوليد') {
        toastApiSuccess(c.cancelOk);
        return;
      }
      toastApiError(error, c.aiFail);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      draftingJobIdRef.current = null;
      setIsDrafting(false);
      setDraftProgress(null);
    }
  }, [descriptionPrompt, isDrafting, selectedLanguage, waitAndOpen]);

  const cancelDraft = useCallback(async () => {
    const jobId = draftingJobIdRef.current || activeJobId;
    abortRef.current?.abort();
    abortRef.current = null;

    if (jobId) {
      try {
        const message = await generateService.cancelJob(jobId);
        toastApiSuccess(message || c.cancelOk);
      } catch (error) {
        toastApiError(error, c.cancelFail);
      }
    }

    draftingJobIdRef.current = null;
    setIsDrafting(false);
    setDraftProgress(null);
    void refreshJobs();
  }, [activeJobId, refreshJobs]);

  const openJob = useCallback(
    async (item: GenerateJobListItem) => {
      const status = String(item.status).toLowerCase();

      if (status === 'queued' || status === 'processing' || status === 'pending') {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
          await waitAndOpen(item.jobId, controller, c.jobsResume);
        } catch (error) {
          if (controller.signal.aborted) return;
          const message = error instanceof Error ? error.message : '';
          if (message === 'تم إلغاء التوليد' || message === 'تم إلغاء انتظار التوليد') {
            toastApiSuccess(c.cancelOk);
            return;
          }
          toastApiError(error, c.jobsOpenFail);
        } finally {
          if (abortRef.current === controller) abortRef.current = null;
          draftingJobIdRef.current = null;
          setIsDrafting(false);
          setDraftProgress(null);
        }
        return;
      }

      try {
        const job = await generateService.getJob(item.jobId);
        openCompletedJob(job);
      } catch (error) {
        toastApiError(error, c.jobsOpenFail);
      }
    },
    [openCompletedJob, waitAndOpen],
  );

  const requestDeleteJob = useCallback((job: GenerateJobListItem) => {
    setJobPendingDelete(job);
  }, []);

  const cancelDeleteJob = useCallback(() => {
    if (deletingJobId) return;
    setJobPendingDelete(null);
  }, [deletingJobId]);

  const confirmDeleteJob = useCallback(async () => {
    if (!jobPendingDelete || deletingJobId) return;
    const jobId = jobPendingDelete.jobId;
    setDeletingJobId(jobId);
    try {
      await generateService.deleteJob(jobId);
      setJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      if (activeJobId === jobId) setActiveJobId(null);
      setJobPendingDelete(null);
      toastApiSuccess(c.jobsDeleteOk);
    } catch (error) {
      toastApiError(error, c.jobsDeleteFail);
    } finally {
      setDeletingJobId(null);
    }
  }, [jobPendingDelete, deletingJobId, activeJobId]);

  const submitWizard = useCallback(() => {
    if (!selectedTemplate) return;
    const content = compileTemplateDraft(selectedTemplate, wizardValues);
    openEditor(`${selectedTemplate.name}${c.draftSuffix}`, content, {
      jobId: null,
      validation: null,
      reportUrl: null,
    });
  }, [selectedTemplate, wizardValues, openEditor]);

  const saveDraft = useCallback(async () => {
    if (!activeJobId) {
      toastApiSuccess(c.saveOkLocal);
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    try {
      const message = await generateService.updateContract(activeJobId, editorContent);
      toastApiSuccess(message || c.saveOk);

      try {
        setIsValidating(true);
        const validated = await generateService.validate(activeJobId);
        setValidation(validated.validationResult);
      } catch {
        // Save succeeded; validation is optional.
      } finally {
        setIsValidating(false);
      }
    } catch (error) {
      toastApiError(error, c.saveFail);
    } finally {
      setIsSaving(false);
    }
  }, [activeJobId, editorContent, isSaving]);

  const commitVersion = useCallback(() => {
    const next = `v1.0.${editorHistory.length}`;
    setEditorHistory((prev) => [
      ...prev,
      { v: next, date: `${TODAY} (تعديل)`, content: editorContent },
    ]);
    setActiveVersion(next);
    toastApiSuccess(c.versionOk);
  }, [editorHistory.length, editorContent]);

  const restoreVersion = useCallback(
    (ver: string) => {
      const target = editorHistory.find((h) => h.v === ver);
      if (!target) return;
      setEditorContent(target.content);
      setActiveVersion(ver);
    },
    [editorHistory],
  );

  const insertClause = useCallback((title: string, text: string) => {
    setEditorContent((prev) => `${prev}\n\n### ${title}\n${text}\n`);
    toastApiSuccess(c.insertOk);
  }, []);

  const rewriteDraft = useCallback(
    async (instructions: string) => {
      if (!instructions.trim()) return;

      if (!activeJobId) {
        setEditorContent(
          (prev) =>
            `# شروط تعاقدية معدلة بالذكاء الاصطناعي\n\n*(مسودة معدلة استناداً إلى: "${instructions}")*\n\n${prev}`,
        );
        toastApiSuccess(c.rewriteLocalOk);
        return;
      }

      if (isRewriting) return;
      setIsRewriting(true);
      setDraftProgress({ progress: 0, stage: c.rewriting, step: '' });

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      draftingJobIdRef.current = activeJobId;

      try {
        try {
          await generateService.updateContract(activeJobId, editorContent);
        } catch {
          // continue regenerate even if interim save fails
        }

        await generateService.regenerate(activeJobId, instructions);
        const completed = await generateService.waitForCompletion(activeJobId, {
          signal: controller.signal,
          onProgress: (job) => setDraftProgress(toProgress(job, c.rewriting)),
        });

        const content = resolveContractMarkdown(completed);
        if (content) setEditorContent(content);
        setValidation(completed.result?.validationResult ?? null);
        setReportUrl(completed.files?.report ?? null);
        toastApiSuccess(c.rewriteOk);
        void refreshJobs();
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : '';
        if (message === 'تم إلغاء التوليد' || message === 'تم إلغاء انتظار التوليد') {
          toastApiSuccess(c.cancelOk);
          return;
        }
        toastApiError(error, c.rewriteFail);
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        draftingJobIdRef.current = null;
        setIsRewriting(false);
        setDraftProgress(null);
      }
    },
    [activeJobId, editorContent, isRewriting, refreshJobs],
  );

  const runValidation = useCallback(async () => {
    if (!activeJobId || isValidating) return;
    setIsValidating(true);
    try {
      await generateService.updateContract(activeJobId, editorContent).catch(() => undefined);
      const validated = await generateService.validate(activeJobId);
      setValidation(validated.validationResult);
      toastApiSuccess(c.validateOk);
    } catch (error) {
      toastApiError(error, c.validateFail);
    } finally {
      setIsValidating(false);
    }
  }, [activeJobId, editorContent, isValidating]);

  const downloadDraft = useCallback(async () => {
    if (!editorContent.trim()) {
      toastApiError(null, c.downloadUnavailable);
      return;
    }
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      await exportContractPdf({
        title: editorTitle,
        content: editorContent,
        jobId: activeJobId,
        fileName: editorTitle,
      });
      toastApiSuccess(c.downloadOk);
    } catch (error) {
      toastApiError(error, c.downloadFail);
    } finally {
      setIsDownloading(false);
    }
  }, [activeJobId, editorContent, editorTitle, isDownloading]);

  return {
    viewMode,
    selectedTemplate,
    descriptionPrompt,
    setDescriptionPrompt,
    selectedLanguage,
    setSelectedLanguage,
    isDrafting,
    draftProgress,
    wizardValues,
    setWizardValues,
    editorTitle,
    setEditorTitle,
    editorContent,
    setEditorContent,
    showAiAssist,
    setShowAiAssist,
    showRiskScanner,
    setShowRiskScanner,
    editorHistory,
    activeVersion,
    activeJobId,
    validation,
    reportUrl,
    isSaving,
    isValidating,
    isRewriting,
    isDownloading,
    jobs,
    isLoadingJobs,
    deletingJobId,
    jobPendingDelete,
    openWizard,
    goLibrary,
    submitAiDraft,
    cancelDraft,
    submitWizard,
    saveDraft,
    commitVersion,
    restoreVersion,
    insertClause,
    rewriteDraft,
    runValidation,
    downloadDraft,
    refreshJobs,
    openJob,
    requestDeleteJob,
    cancelDeleteJob,
    confirmDeleteJob,
  };
}
