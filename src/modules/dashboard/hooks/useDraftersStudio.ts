'use client';

import { useCallback, useState } from 'react';
import type {
  ContractTemplate,
  DraftOutputLang,
  DrafterViewMode,
  DraftVersion,
} from '@/types/drafter.types';
import { drafterCopy as c } from '../data/drafterCopy';
import { buildMockAiDraft, compileTemplateDraft } from '../lib/compileDraft';

const TODAY = '١٣ يوليو ٢٠٢٦';

export function useDraftersStudio() {
  const [viewMode, setViewMode] = useState<DrafterViewMode>('library');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [descriptionPrompt, setDescriptionPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<DraftOutputLang>('Arabic');
  const [isDrafting, setIsDrafting] = useState(false);
  const [wizardValues, setWizardValues] = useState<Record<string, string>>({});
  const [editorTitle, setEditorTitle] = useState('مسودة اتفاقية حفظ سرية ثنائية');
  const [editorContent, setEditorContent] = useState('');
  const [showAiAssist, setShowAiAssist] = useState(true);
  const [showRiskScanner, setShowRiskScanner] = useState(true);
  const [editorHistory, setEditorHistory] = useState<DraftVersion[]>([
    { v: 'v1.0.0', date: TODAY, content: '' },
  ]);
  const [activeVersion, setActiveVersion] = useState('v1.0.0');

  const openWizard = useCallback((tmpl: ContractTemplate) => {
    setSelectedTemplate(tmpl);
    setWizardValues({});
    setViewMode('wizard');
  }, []);

  const goLibrary = useCallback(() => setViewMode('library'), []);

  const openEditor = useCallback((title: string, content: string) => {
    setEditorTitle(title);
    setEditorContent(content);
    setEditorHistory([{ v: 'v1.0.0', date: TODAY, content }]);
    setActiveVersion('v1.0.0');
    setViewMode('editor');
  }, []);

  const submitAiDraft = useCallback(async () => {
    if (!descriptionPrompt.trim() || isDrafting) return;
    setIsDrafting(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const content = buildMockAiDraft(descriptionPrompt.trim(), selectedLanguage);
      const title = `${selectedTemplate?.name || c.customDraft}${c.draftSuffix}`;
      openEditor(title, content);
    } catch {
      alert(c.aiFail);
    } finally {
      setIsDrafting(false);
    }
  }, [descriptionPrompt, isDrafting, selectedLanguage, selectedTemplate, openEditor]);

  const submitWizard = useCallback(() => {
    if (!selectedTemplate) return;
    const content = compileTemplateDraft(selectedTemplate, wizardValues);
    openEditor(`${selectedTemplate.name}${c.draftSuffix}`, content);
  }, [selectedTemplate, wizardValues, openEditor]);

  const saveDraft = useCallback(() => {
    alert(c.saveOk);
  }, []);

  const commitVersion = useCallback(() => {
    const next = `v1.0.${editorHistory.length}`;
    setEditorHistory((prev) => [...prev, { v: next, date: `${TODAY} (تعديل)`, content: editorContent }]);
    setActiveVersion(next);
    alert(c.versionOk);
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
    alert(c.insertOk);
  }, []);

  const rewriteDraft = useCallback(() => {
    const instructions = prompt(c.rewritePrompt);
    if (!instructions) return;
    alert(c.rewriting);
    setEditorContent(
      (prev) => `# شروط تعاقدية معدلة بالذكاء الاصطناعي\n\n*(مسودة معدلة استناداً إلى: "${instructions}")*\n\n${prev}`,
    );
  }, []);

  return {
    viewMode,
    selectedTemplate,
    descriptionPrompt,
    setDescriptionPrompt,
    selectedLanguage,
    setSelectedLanguage,
    isDrafting,
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
    openWizard,
    goLibrary,
    submitAiDraft,
    submitWizard,
    saveDraft,
    commitVersion,
    restoreVersion,
    insertClause,
    rewriteDraft,
  };
}
