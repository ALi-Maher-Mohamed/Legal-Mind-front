'use client';

import type { DraftVersion } from '@/types/drafter.types';
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
  history: DraftVersion[];
  activeVersion: string;
  onRestore: (v: string) => void;
  onCommitVersion: () => void;
  onInsertClause: (title: string, text: string) => void;
  onRewrite: () => void;
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
        onToggleAi={props.onToggleAi}
        onToggleRisk={props.onToggleRisk}
        onBack={props.onBack}
        onSave={props.onSave}
      />

      <div className="grid h-[min(70vh,550px)] grid-cols-1 gap-4 overflow-hidden lg:grid-cols-12 lg:gap-6">
        {props.showAiAssist && (
          <div className="h-full min-h-[280px] lg:col-span-3 lg:min-h-0">
            <AiAssistPanel onInsert={props.onInsertClause} onRewrite={props.onRewrite} />
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
        />
        {props.showRiskScanner && (
          <div className="h-full min-h-[280px] lg:col-span-3 lg:min-h-0">
            <RiskScannerPanel />
          </div>
        )}
      </div>
    </div>
  );
}
