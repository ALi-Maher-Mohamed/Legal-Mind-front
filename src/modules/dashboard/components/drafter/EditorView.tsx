'use client';

import type { DraftVersion } from '@/types/drafter.types';
import type { GenerateValidationResult } from '@/types/generate.types';
import EditorHeader from './EditorHeader';
import AiAssistPanel from './AiAssistPanel';
import EditorSheet from './EditorSheet';
import RiskScannerPanel from './RiskScannerPanel';

type Props = {
  title: string;
  onTitleChange: (v: string) => void;
  content: string;
  onContentChange: (v: string) => void;
  showAiAssist: boolean;
  showRiskScanner: boolean;
  onToggleAi: () => void;
  onToggleRisk: () => void;
  onBack: () => void;
  onSave: () => void;
  onDownload: () => void;
  canDownload: boolean;
  isSaving: boolean;
  isDownloading?: boolean;
  isRewriting: boolean;
  validation: GenerateValidationResult | null;
  isValidating: boolean;
  canValidate: boolean;
  onValidate: () => void;
  history: DraftVersion[];
  activeVersion: string;
  onRestore: (v: string) => void;
  onCommitVersion: () => void;
  onInsertClause: (title: string, text: string) => void;
  onRewrite: (instructions: string) => void;
};

export default function EditorView(props: Props) {
  const span =
    props.showAiAssist && props.showRiskScanner
      ? 'lg:col-span-6'
      : !props.showAiAssist && !props.showRiskScanner
        ? 'lg:col-span-12'
        : 'lg:col-span-9';

  return (
    <div className="space-y-6 pb-8">
      <EditorHeader
        title={props.title}
        onTitleChange={props.onTitleChange}
        showAiAssist={props.showAiAssist}
        showRiskScanner={props.showRiskScanner}
        isSaving={props.isSaving || props.isRewriting}
        isDownloading={props.isDownloading}
        canDownload={props.canDownload}
        onToggleAi={props.onToggleAi}
        onToggleRisk={props.onToggleRisk}
        onBack={props.onBack}
        onSave={props.onSave}
        onDownload={props.onDownload}
      />

      <div className="grid h-[min(78vh,720px)] grid-cols-1 gap-4 overflow-hidden lg:grid-cols-12 lg:gap-6">
        {props.showAiAssist && (
          <div className="h-full min-h-[280px] lg:col-span-3 lg:min-h-0">
            <AiAssistPanel
              onInsert={props.onInsertClause}
              onRewrite={(instructions) => props.onRewrite(instructions)}
              isRewriting={props.isRewriting}
            />
          </div>
        )}
        <EditorSheet
          content={props.content}
          onChange={props.onContentChange}
          history={props.history}
          activeVersion={props.activeVersion}
          onRestore={props.onRestore}
          onCommitVersion={props.onCommitVersion}
          spanClass={span}
          editable={!props.isRewriting && !props.isSaving}
        />
        {props.showRiskScanner && (
          <div className="h-full min-h-[280px] lg:col-span-3 lg:min-h-0">
            <RiskScannerPanel
              validation={props.validation}
              isValidating={props.isValidating}
              canValidate={props.canValidate}
              onValidate={props.onValidate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
