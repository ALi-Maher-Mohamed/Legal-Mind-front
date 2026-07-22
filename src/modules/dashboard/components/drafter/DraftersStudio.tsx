'use client';

import { useDraftersStudio } from '../../hooks/useDraftersStudio';
import LibraryView from './LibraryView';
import WizardView from './WizardView';
import EditorView from './EditorView';

export default function DraftersStudio() {
  const d = useDraftersStudio();

  if (d.viewMode === 'wizard' && d.selectedTemplate) {
    return (
      <WizardView
        template={d.selectedTemplate}
        values={d.wizardValues}
        onChange={(name, value) => d.setWizardValues((prev) => ({ ...prev, [name]: value }))}
        onBack={d.goLibrary}
        onSubmit={d.submitWizard}
      />
    );
  }

  if (d.viewMode === 'editor') {
    return (
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
        onSave={d.saveDraft}
        history={d.editorHistory}
        activeVersion={d.activeVersion}
        onRestore={d.restoreVersion}
        onCommitVersion={d.commitVersion}
        onInsertClause={d.insertClause}
        onRewrite={d.rewriteDraft}
      />
    );
  }

  return (
    <LibraryView
      prompt={d.descriptionPrompt}
      onPromptChange={d.setDescriptionPrompt}
      language={d.selectedLanguage}
      onLanguageChange={d.setSelectedLanguage}
      isDrafting={d.isDrafting}
      onAiSubmit={() => void d.submitAiDraft()}
      onOpenWizard={d.openWizard}
    />
  );
}
