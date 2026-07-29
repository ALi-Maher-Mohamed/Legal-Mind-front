'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { TableKit } from '@tiptap/extension-table/kit';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import { htmlToMarkdown, markdownToHtml } from '../../../lib/markdownBridge';
import { drafterCopy as c } from '../../../data/drafterCopy';
import EditorToolbar from './EditorToolbar';

type Props = {
  content: string;
  onChange: (markdown: string) => void;
  editable?: boolean;
};

const DEBOUNCE_MS = 180;

const LAW_CITE_HTML = `
<blockquote>
  <p><strong>مرجع قانوني:</strong> قانون العمل المصري رقم 12 لسنة 2003 — المادة (____)</p>
  <p>نص المرجع أو الملاحظة القانونية...</p>
</blockquote>
`;

export default function ContractRichEditor({ content, onChange, editable = true }: Props) {
  const lastEmittedRef = useRef(content);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, setToolbarTick] = useState(0);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
        },
      }),
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'right',
      }),
      TableKit.configure({
        table: { resizable: false },
      }),
      Placeholder.configure({
        placeholder: c.editorPlaceholder,
      }),
      CharacterCount.configure({ limit: null }),
    ],
    [],
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable,
    extensions,
    content: markdownToHtml(content),
    editorProps: {
      attributes: {
        class: 'contract-editor-prose focus:outline-none min-h-full',
        dir: 'rtl',
        lang: 'ar',
      },
    },
    onUpdate: ({ editor: ed }) => {
      const markdown = htmlToMarkdown(ed.getHTML());
      lastEmittedRef.current = markdown;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange(markdown);
      }, DEBOUNCE_MS);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const refresh = () => setToolbarTick((n) => n + 1);
    editor.on('selectionUpdate', refresh);
    editor.on('transaction', refresh);
    return () => {
      editor.off('selectionUpdate', refresh);
      editor.off('transaction', refresh);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor) return;
    if (content === lastEmittedRef.current) return;

    const html = markdownToHtml(content);
    editor.commands.setContent(html, { emitUpdate: false });
    lastEmittedRef.current = content;
  }, [content, editor]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!editor) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-xs text-muted">
        {c.editorLoading}
      </div>
    );
  }

  const chars = editor.storage.characterCount.characters();
  const words = editor.storage.characterCount.words();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EditorToolbar
        editor={editor}
        onInsertLawCite={() => {
          editor.chain().focus().insertContent(LAW_CITE_HTML).run();
        }}
      />

      <div className="relative mt-2 min-h-0 flex-1 overflow-y-auto rounded-xl border border-brand/10 bg-[#fbfdff] px-2.5 py-2 dark:border-white/10 dark:bg-white/[0.03] sm:mt-3 sm:px-4 sm:py-3">
        <EditorContent editor={editor} className="h-full" />
      </div>

      <div className="mt-2 flex shrink-0 items-center justify-between gap-2 text-[10px] text-muted">
        <span className="hidden min-w-0 truncate sm:inline">{c.editorHint}</span>
        <span className="shrink-0 sm:ms-auto">
          {words} {c.words} · {chars} {c.chars}
        </span>
      </div>
    </div>
  );
}
