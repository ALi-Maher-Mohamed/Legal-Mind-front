'use client';

import { useCallback, useRef, useState } from 'react';
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
  GenerateProgressState,
  GenerateValidationResult,
} from '@/types/generate.types';
import { drafterCopy as c } from '../data/drafterCopy';
import { compileTemplateDraft } from '../lib/compileDraft';

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
  const [showAiAssist, setShowAiAssist] = useState(true);
  const [showRiskScanner, setShowRiskScanner] = useState(true);
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
  const abortRef = useRef<AbortController | null>(null);

  const openWizard = useCallback((tmpl: ContractTemplate) => {
    setSelectedTemplate(tmpl);
    setWizardValues({});
    setViewMode('wizard');
  }, []);

  const goLibrary = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setViewMode('library');
  }, []);

  const openEditor = useCallback(
    (title: string, content: string, options?: {
      jobId?: string | null;
      validation?: GenerateValidationResult | null;
      reportUrl?: string | null;
    }) => {
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
      setActiveJobId(created.jobId);

      const completed = await generateService.waitForCompletion(created.jobId, {
        signal: controller.signal,
        onProgress: (job) => {
          setDraftProgress({
            progress: typeof job.progress === 'number' ? job.progress : 0,
            stage: job.currentStage || c.drafting,
            step: job.currentStep || '',
          });
        },
      });

      const content = resolveContractMarkdown(completed);
      if (!content) {
        throw new Error('اكتمل التوليد بدون نص عقد');
      }

      const title = resolveContractTitle(
        completed,
        `${selectedTemplate?.name || c.customDraft}${c.draftSuffix}`,
      );

      openEditor(title, content, {
        jobId: completed.jobId,
        validation: completed.result?.validationResult ?? null,
        reportUrl: completed.files?.report ?? null,
      });
      toastApiSuccess(c.generateOk);
    } catch (error) {
      if (controller.signal.aborted) return;
      toastApiError(error, c.aiFail);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setIsDrafting(false);
      setDraftProgress(null);
    }
  }, [descriptionPrompt, isDrafting, selectedLanguage, selectedTemplate, openEditor]);

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

      // Refresh validation after save when possible.
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

  const rewriteDraft = useCallback(async () => {
    const instructions = window.prompt(c.rewritePrompt);
    if (!instructions?.trim()) return;

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

    try {
      // Persist current edits before regenerate when possible.
      try {
        await generateService.updateContract(activeJobId, editorContent);
      } catch {
        // continue regenerate even if interim save fails
      }

      await generateService.regenerate(activeJobId, instructions);
      const completed = await generateService.waitForCompletion(activeJobId, {
        onProgress: (job) => {
          setDraftProgress({
            progress: typeof job.progress === 'number' ? job.progress : 0,
            stage: job.currentStage || c.rewriting,
            step: job.currentStep || '',
          });
        },
      });

      const content = resolveContractMarkdown(completed);
      if (content) setEditorContent(content);
      setValidation(completed.result?.validationResult ?? null);
      setReportUrl(completed.files?.report ?? null);
      toastApiSuccess(c.rewriteOk);
    } catch (error) {
      toastApiError(error, c.rewriteFail);
    } finally {
      setIsRewriting(false);
      setDraftProgress(null);
    }
  }, [activeJobId, editorContent, isRewriting]);

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
    if (reportUrl) {
      window.open(reportUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!activeJobId) {
      toastApiError(null, c.downloadUnavailable);
      return;
    }
    try {
      await generateService.downloadContract(activeJobId, `${editorTitle || 'contract'}.md`);
    } catch (error) {
      toastApiError(error, c.downloadFail);
    }
  }, [activeJobId, editorTitle, reportUrl]);

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
    openWizard,
    goLibrary,
    submitAiDraft,
    submitWizard,
    saveDraft,
    commitVersion,
    restoreVersion,
    insertClause,
    rewriteDraft,
    runValidation,
    downloadDraft,
  };
}
