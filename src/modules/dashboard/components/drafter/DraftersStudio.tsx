'use client';

import { useDraftersStudio } from '../../hooks/useDraftersStudio';
import { drafterCopy as c } from '../../data/drafterCopy';
import ConfirmModal from '../ui/ConfirmModal';
import LibraryView from './LibraryView';
import WizardView from './WizardView';
import EditorView from './EditorView';

export default function DraftersStudio() {
  const d = useDraftersStudio();

  const body =
    d.viewMode === 'wizard' && d.selectedTemplate ? (
      <WizardView
        template={d.selectedTemplate}
        values={d.wizardValues}
        onChange={(name, value) => d.setWizardValues((prev) => ({ ...prev, [name]: value }))}
        onBack={d.goLibrary}
        onSubmit={d.submitWizard}
      />
    ) : d.viewMode === 'editor' ? (
      <EditorView
        title={d.editorTitle}
        onTitleChange={d.setEditorTitle}
        content={d.editorContent}
        onContentChange={d.setEditorContent}
        showAiAssist={d.showAiAssist}
        showRiskScanner={d.showRiskScanner}
        onToggleAi={() => d.setShowAiAssist((v) => !v)}
        onToggleRisk={() => d.setShowRiskScanner((v) => !v)}
        onBack={d.goLibrary}
        onSave={() => void d.saveDraft()}
        onDownload={() => void d.downloadDraft()}
        canDownload={Boolean(d.editorContent.trim())}
        isSaving={d.isSaving}
        isDownloading={d.isDownloading}
        isRewriting={d.isRewriting}
        validation={d.validation}
        isValidating={d.isValidating}
        canValidate={Boolean(d.activeJobId)}
        onValidate={() => void d.runValidation()}
        history={d.editorHistory}
        activeVersion={d.activeVersion}
        onRestore={d.restoreVersion}
        onCommitVersion={d.commitVersion}
        onInsertClause={d.insertClause}
        onRewrite={(instructions) => void d.rewriteDraft(instructions)}
      />
    ) : (
      <LibraryView
        prompt={d.descriptionPrompt}
        onPromptChange={d.setDescriptionPrompt}
        language={d.selectedLanguage}
        onLanguageChange={d.setSelectedLanguage}
        isDrafting={d.isDrafting}
        draftProgress={d.draftProgress}
        onAiSubmit={() => void d.submitAiDraft()}
        onCancelDraft={() => void d.cancelDraft()}
        onOpenWizard={d.openWizard}
        jobs={d.jobs}
        isLoadingJobs={d.isLoadingJobs}
        deletingJobId={d.deletingJobId}
        onRefreshJobs={() => void d.refreshJobs()}
        onOpenJob={(job) => void d.openJob(job)}
        onDeleteJob={d.requestDeleteJob}
      />
    );

  return (
    <>
      {body}
      <ConfirmModal
        open={Boolean(d.jobPendingDelete)}
        title={c.jobsDeleteTitle}
        description={c.jobsDeleteDesc}
        confirmLabel={c.jobsDeleteConfirm}
        cancelLabel={c.jobsDeleteCancel}
        isLoading={Boolean(d.deletingJobId)}
        onConfirm={() => void d.confirmDeleteJob()}
        onCancel={d.cancelDeleteJob}
      />
    </>
  );
}
