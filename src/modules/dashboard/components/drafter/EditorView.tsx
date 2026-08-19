"use client";

import type { DraftVersion } from "@/types/drafter.types";
import EditorHeader from "./EditorHeader";
import AiAssistPanel from "./AiAssistPanel";
import EditorSheet from "./EditorSheet";

type Props = {
  title: string;
  onTitleChange: (v: string) => void;
  content: string;
  onContentChange: (v: string) => void;
  showAiAssist: boolean;
  onToggleAi: () => void;
  onBack: () => void;
  onSave: () => void;
  onDownload: () => void;
  canDownload: boolean;
  isSaving: boolean;
  isDownloading?: boolean;
  isRewriting: boolean;
  history: DraftVersion[];
  activeVersion: string;
  onRestore: (v: string) => void;
  onCommitVersion: () => void;
  onInsertClause: (title: string, text: string) => void;
  onRewrite: (instructions: string) => void;
};

export default function EditorView(props: Props) {
  const editorSpan = props.showAiAssist ? "lg:col-span-8" : "lg:col-span-12";
  const sidePanelClass =
    "h-[min(42vh,340px)] min-h-[220px] sm:h-[min(38vh,320px)] md:h-[min(36vh,300px)] lg:h-full lg:min-h-0 lg:col-span-4";

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-4 pb-6 sm:space-y-5 sm:pb-8">
      <EditorHeader
        title={props.title}
        onTitleChange={props.onTitleChange}
        showAiAssist={props.showAiAssist}
        isSaving={props.isSaving || props.isRewriting}
        isDownloading={props.isDownloading}
        canDownload={props.canDownload}
        onToggleAi={props.onToggleAi}
        onBack={props.onBack}
        onSave={props.onSave}
        onDownload={props.onDownload}
      />

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:h-[min(78vh,720px)] lg:grid-cols-12 lg:gap-5 lg:overflow-hidden xl:gap-6">
        {props.showAiAssist ? (
          <div className={`order-2 lg:order-1 ${sidePanelClass}`}>
            <AiAssistPanel
              onInsert={props.onInsertClause}
              onRewrite={(instructions) => props.onRewrite(instructions)}
              isRewriting={props.isRewriting}
            />
          </div>
        ) : null}

        <div
          className={`order-1 min-h-[58vh] sm:min-h-[62vh] lg:order-2 lg:min-h-0 lg:h-full ${editorSpan}`}
        >
          <EditorSheet
            content={props.content}
            onChange={props.onContentChange}
            history={props.history}
            activeVersion={props.activeVersion}
            onRestore={props.onRestore}
            onCommitVersion={props.onCommitVersion}
            spanClass="h-full"
            editable={!props.isRewriting && !props.isSaving}
          />
        </div>
      </div>
    </div>
  );
}
