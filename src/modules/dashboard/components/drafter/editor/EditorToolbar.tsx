'use client';

import type { ReactNode } from 'react';
import type { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Scale,
  Strikethrough,
  Table,
  Underline,
  Undo2,
} from 'lucide-react';
import { drafterCopy as c } from '../../../data/drafterCopy';

type Props = {
  editor: Editor;
  onInsertLawCite: () => void;
};

function ToolBtn({
  active,
  disabled,
  title,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-1.5 text-[11px] font-bold transition cursor-pointer disabled:opacity-35 ${
        active
          ? 'bg-brand text-on-brand'
          : 'text-muted hover:bg-brand/10 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-0.5 hidden h-5 w-px shrink-0 bg-brand/15 sm:block dark:bg-white/15" />;
}

export default function EditorToolbar({ editor, onInsertLawCite }: Props) {
  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt(c.linkPrompt, prev || 'https://');
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div className="-mx-0.5 flex shrink-0 items-center gap-0.5 overflow-x-auto overscroll-x-contain border-b border-brand/10 px-0.5 pb-2.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:pb-3 [&::-webkit-scrollbar]:hidden dark:border-white/10">
      <span className="me-1 hidden shrink-0 border-e border-brand/15 pe-2 text-xs font-bold text-foreground sm:inline dark:border-white/15">
        {c.sheet}
      </span>

      <ToolBtn
        title={c.undo}
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.redo}
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="h-3.5 w-3.5" />
      </ToolBtn>

      <Sep />

      <ToolBtn
        title={c.bold}
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.italic}
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.underline}
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.strike}
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.highlight}
        active={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="h-3.5 w-3.5" />
      </ToolBtn>

      <Sep />

      <ToolBtn
        title={c.paragraph}
        active={editor.isActive('paragraph')}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.heading1}
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.heading2}
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.heading3}
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-3.5 w-3.5" />
      </ToolBtn>

      <Sep />

      <ToolBtn
        title={c.bulletList}
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.orderedList}
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.blockquote}
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.horizontalRule}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-3.5 w-3.5" />
      </ToolBtn>

      <Sep />

      <ToolBtn
        title={c.alignRight}
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.alignCenter}
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.alignLeft}
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.alignJustify}
        active={editor.isActive({ textAlign: 'justify' })}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <AlignJustify className="h-3.5 w-3.5" />
      </ToolBtn>

      <Sep />

      <ToolBtn title={c.link} active={editor.isActive('link')} onClick={setLink}>
        <Link2 className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.insertTable}
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <Table className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn title={c.lawIndex} onClick={onInsertLawCite}>
        <Scale className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.clearFormat}
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        <Eraser className="h-3.5 w-3.5" />
      </ToolBtn>
    </div>
  );
}
