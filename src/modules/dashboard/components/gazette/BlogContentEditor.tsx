'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  Bold,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Strikethrough,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react';
import { toastApiError, toastApiSuccess } from '@/lib/api/toast';
import { blogsService } from '@/services/blogs.service';
import { gazetteCopy as c } from '../../data/gazetteCopy';
import { looksLikeHtml, markdownToHtmlSafe } from '../../lib/blogContent';
import { BlogImage, type BlogImageAlign } from './blogImageExtension';

type Props = {
  content: string;
  onChange: (html: string) => void;
};

const WIDTH_PRESETS = [
  { label: '٢٥٪', value: '25%' },
  { label: '٤٠٪', value: '40%' },
  { label: '٦٠٪', value: '60%' },
  { label: '٨٠٪', value: '80%' },
  { label: '١٠٠٪', value: '100%' },
] as const;

const COVER_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
const MAX_BYTES = 5 * 1024 * 1024;

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
      className={`inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-1.5 transition cursor-pointer disabled:opacity-35 ${
        active
          ? 'bg-[#002045] text-white'
          : 'text-[#43474e] hover:bg-[#002045]/10 hover:text-[#002045] dark:text-muted dark:hover:bg-white/10 dark:hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return (
    <span className="mx-0.5 hidden h-5 w-px shrink-0 bg-[#c4c6cf] sm:block dark:bg-white/15" />
  );
}

function normalizeWidthInput(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (/^\d{1,3}%$/.test(value)) {
    const n = Number(value.replace('%', ''));
    if (n < 10 || n > 100) return null;
    return `${n}%`;
  }
  if (/^\d{2,4}px$/i.test(value)) {
    const n = Number(value.replace(/px/i, ''));
    if (n < 80 || n > 1600) return null;
    return `${n}px`;
  }
  if (/^\d{1,4}$/.test(value)) {
    const n = Number(value);
    if (n <= 100) {
      if (n < 10) return null;
      return `${n}%`;
    }
    if (n < 80 || n > 1600) return null;
    return `${n}px`;
  }
  return null;
}

function ImageSizeBar({ editor }: { editor: Editor }) {
  const attrs = editor.getAttributes('image') as {
    width?: string;
    height?: string | null;
    align?: BlogImageAlign;
  };
  const width = attrs.width || '100%';
  const height = attrs.height || 'auto';
  const align = attrs.align || 'center';
  const [customWidth, setCustomWidth] = useState(width);
  const [customHeight, setCustomHeight] = useState(
    height === 'auto' || !height ? '' : String(height),
  );

  useEffect(() => {
    setCustomWidth(width);
    setCustomHeight(height === 'auto' || !height ? '' : String(height));
  }, [width, height]);

  const setWidth = (next: string) => {
    editor.chain().focus().updateAttributes('image', { width: next }).run();
  };

  const setAlign = (next: BlogImageAlign) => {
    editor.chain().focus().updateAttributes('image', { align: next }).run();
  };

  const applyCustomWidth = () => {
    const next = normalizeWidthInput(customWidth);
    if (!next) {
      toastApiError(new Error(c.imageWidthInvalid), c.imageWidthInvalid);
      return;
    }
    setWidth(next);
  };

  const applyCustomHeight = () => {
    const raw = customHeight.trim();
    if (!raw) {
      editor
        .chain()
        .focus()
        .updateAttributes('image', { height: null })
        .run();
      return;
    }
    if (!/^\d{2,4}(px)?$/i.test(raw)) {
      toastApiError(new Error(c.imageHeightInvalid), c.imageHeightInvalid);
      return;
    }
    const n = Number(raw.replace(/px/i, ''));
    if (n < 40 || n > 1200) {
      toastApiError(new Error(c.imageHeightInvalid), c.imageHeightInvalid);
      return;
    }
    editor
      .chain()
      .focus()
      .updateAttributes('image', { height: `${n}px` })
      .run();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e8ee] bg-[#f7f9fc] px-2 py-2 dark:border-white/10 dark:bg-white/5">
      <span className="text-[11px] font-bold text-[#002045] dark:text-foreground">
        {c.imageControls}
      </span>

      <div className="flex flex-wrap items-center gap-1">
        {WIDTH_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setWidth(preset.value)}
            className={`rounded-md px-2 py-1 text-[11px] font-bold transition cursor-pointer ${
              width === preset.value
                ? 'bg-[#002045] text-white dark:bg-brand dark:text-on-brand'
                : 'bg-white text-muted hover:text-foreground dark:bg-card dark:hover:bg-white/10'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <input
          type="text"
          value={customWidth}
          onChange={(e) => setCustomWidth(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              applyCustomWidth();
            }
          }}
          placeholder={c.imageWidthPlaceholder}
          className="h-7 w-20 rounded-md border border-[#c4c6cf] bg-white px-2 text-[11px] outline-none focus:border-[#002045] dark:border-white/15 dark:bg-[#0d1528] dark:text-foreground"
          aria-label={c.imageWidthLabel}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={applyCustomWidth}
          className="h-7 rounded-md bg-[#002045] px-2 text-[11px] font-bold text-white cursor-pointer dark:bg-brand dark:text-on-brand"
        >
          {c.imageApply}
        </button>
      </div>

      <div className="flex items-center gap-1">
        <input
          type="text"
          value={customHeight}
          onChange={(e) => setCustomHeight(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              applyCustomHeight();
            }
          }}
          placeholder={c.imageHeightPlaceholder}
          className="h-7 w-20 rounded-md border border-[#c4c6cf] bg-white px-2 text-[11px] outline-none focus:border-[#002045] dark:border-white/15 dark:bg-[#0d1528] dark:text-foreground"
          aria-label={c.imageHeightLabel}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={applyCustomHeight}
          className="h-7 rounded-md border border-[#c4c6cf] px-2 text-[11px] font-bold text-muted hover:text-foreground cursor-pointer dark:border-white/15"
        >
          {c.imageApplyHeight}
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setCustomHeight('');
            editor
              .chain()
              .focus()
              .updateAttributes('image', { height: null })
              .run();
          }}
          className="h-7 rounded-md px-2 text-[11px] font-bold text-muted hover:text-foreground cursor-pointer"
        >
          {c.imageAutoHeight}
        </button>
      </div>

      <Sep />

      <ToolBtn
        title={c.imageAlignRight}
        active={align === 'right'}
        onClick={() => setAlign('right')}
      >
        <AlignRight className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.imageAlignCenter}
        active={align === 'center'}
        onClick={() => setAlign('center')}
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.imageAlignLeft}
        active={align === 'left'}
        onClick={() => setAlign('left')}
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolBtn>

      <Sep />

      <ToolBtn
        title={c.imageRemove}
        onClick={() => editor.chain().focus().deleteSelection().run()}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </ToolBtn>
    </div>
  );
}

function BlogToolbar({
  editor,
  isUploading,
  onUploadClick,
}: {
  editor: Editor;
  isUploading: boolean;
  onUploadClick: () => void;
}) {
  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('رابط URL', prev || 'https://');
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url.trim() })
      .run();
  };

  const insertByUrl = () => {
    const url = window.prompt(c.imageUrlPrompt, 'https://');
    if (!url?.trim()) return;
    editor
      .chain()
      .focus()
      .setImage({ src: url.trim() })
      .updateAttributes('image', { width: '100%', align: 'center' })
      .run();
  };

  return (
    <div className="flex items-center gap-0.5 overflow-x-auto border-b border-[#e5e8ee] px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-white/10">
      <ToolBtn
        title="تراجع"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="إعادة"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="h-3.5 w-3.5" />
      </ToolBtn>
      <Sep />
      <ToolBtn
        title="عريض"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="مائل"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="تسطير"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="يتوسطه خط"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="تمييز"
        active={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="h-3.5 w-3.5" />
      </ToolBtn>
      <Sep />
      <ToolBtn
        title="عنوان"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="عنوان فرعي"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-3.5 w-3.5" />
      </ToolBtn>
      <Sep />
      <ToolBtn
        title="قائمة"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="قائمة مرقمة"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="اقتباس"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-3.5 w-3.5" />
      </ToolBtn>
      <Sep />
      <ToolBtn
        title="يمين"
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="وسط"
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="يسار"
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title="ضبط"
        active={editor.isActive({ textAlign: 'justify' })}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <AlignJustify className="h-3.5 w-3.5" />
      </ToolBtn>
      <Sep />
      <ToolBtn title="رابط" active={editor.isActive('link')} onClick={setLink}>
        <Link2 className="h-3.5 w-3.5" />
      </ToolBtn>
      <ToolBtn
        title={c.imageUpload}
        disabled={isUploading}
        onClick={onUploadClick}
      >
        {isUploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ImageIcon className="h-3.5 w-3.5" />
        )}
      </ToolBtn>
      <ToolBtn title={c.imageFromUrl} onClick={insertByUrl}>
        <span className="px-0.5 text-[10px] font-bold">URL</span>
      </ToolBtn>
    </div>
  );
}

export default function BlogContentEditor({ content, onChange }: Props) {
  const lastEmittedRef = useRef(content);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setToolbarTick] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
        },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'right',
      }),
      BlogImage,
      Placeholder.configure({
        placeholder: c.editorPlaceholder,
      }),
      CharacterCount.configure({ limit: null }),
    ],
    [],
  );

  const initialHtml = looksLikeHtml(content)
    ? content || '<p></p>'
    : markdownToHtmlSafe(content);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions,
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          'contract-editor-prose blog-editor-prose focus:outline-none min-h-[280px]',
        dir: 'rtl',
        lang: 'ar',
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      lastEmittedRef.current = html;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange(html), 160);
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
    if (content === lastEmittedRef.current) return;
    const html = looksLikeHtml(content)
      ? content || '<p></p>'
      : markdownToHtmlSafe(content);
    editor.commands.setContent(html, { emitUpdate: false });
    lastEmittedRef.current = content;
  }, [content, editor]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const uploadInlineImage = async (file: File) => {
    const allowed = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ]);
    if (!allowed.has(file.type)) {
      toastApiError(new Error(c.coverTypeError), c.coverTypeError);
      return;
    }
    if (file.size > MAX_BYTES) {
      toastApiError(new Error(c.coverSizeError), c.coverSizeError);
      return;
    }
    if (!editor) return;

    setIsUploading(true);
    try {
      const result = await blogsService.uploadImage(file);
      editor
        .chain()
        .focus()
        .setImage({ src: result.url, alt: file.name })
        .updateAttributes('image', { width: '100%', align: 'center' })
        .run();
      toastApiSuccess(result.message || c.coverUploadOk);
    } catch (err) {
      toastApiError(err, c.coverUploadFail);
    } finally {
      setIsUploading(false);
    }
  };

  if (!editor) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-[#c4c6cf] bg-[#f8fafc] text-sm text-muted dark:border-white/10 dark:bg-white/5">
        {c.editorLoading}
      </div>
    );
  }

  const chars = editor.storage.characterCount.characters();
  const words = editor.storage.characterCount.words();
  const imageSelected = editor.isActive('image');

  return (
    <div className="overflow-hidden rounded-xl border border-[#c4c6cf] bg-white dark:border-white/10 dark:bg-card">
      <BlogToolbar
        editor={editor}
        isUploading={isUploading}
        onUploadClick={() => fileInputRef.current?.click()}
      />
      {imageSelected ? <ImageSizeBar editor={editor} /> : null}
      <input
        ref={fileInputRef}
        type="file"
        accept={COVER_ACCEPT}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) void uploadInlineImage(file);
        }}
      />
      <div className="min-h-[280px] px-3 py-3 sm:px-4 sm:py-4">
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-[#e5e8ee] px-3 py-2 text-[11px] text-muted dark:border-white/10">
        <span className="hidden sm:inline">{c.editorHint}</span>
        <span className="ms-auto shrink-0">
          {words} {c.words} · {chars} {c.chars}
        </span>
      </div>
    </div>
  );
}
