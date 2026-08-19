import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type FileChild,
  type IRunOptions,
} from 'docx';
import { markdownToHtml } from './markdownBridge';

export type ExportContractDocxOptions = {
  title: string;
  content: string;
  fileName?: string;
};

const BRAND = '003EC7';
const ACCENT = 'D69E2E';
const INK = '152033';
const RULE = 'D8E0EF';
const FONT = 'Arial';
const RTL_LANG = { value: 'ar-SA', bidirectional: 'ar-SA' } as const;

const rtlRun = {
  font: FONT,
  rightToLeft: true,
  language: RTL_LANG,
} as const;

function sanitizeFileName(name: string) {
  return (
    name
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 80) || 'LegalMind_Contract'
  );
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

type RunStyle = {
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
  highlight?: boolean;
  size?: number;
  color?: string;
};

function textRuns(node: Node, style: RunStyle = {}): TextRun[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? '';
    if (!text) return [];
    const options: IRunOptions = {
      text,
      font: FONT,
      size: style.size ?? 24,
      color: style.color ?? INK,
      bold: style.bold,
      italics: style.italics,
      rightToLeft: true,
      language: RTL_LANG,
      ...(style.underline ? { underline: {} } : {}),
      ...(style.highlight ? { highlight: 'yellow' as const } : {}),
    };
    return [new TextRun(options)];
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return [];
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  if (tag === 'br') {
    return [new TextRun({ break: 1 })];
  }

  const next: RunStyle = { ...style };
  if (tag === 'strong' || tag === 'b') next.bold = true;
  if (tag === 'em' || tag === 'i') next.italics = true;
  if (tag === 'u') next.underline = true;
  if (tag === 'mark') next.highlight = true;
  if (tag === 'a') next.color = BRAND;

  return Array.from(el.childNodes).flatMap((child) => textRuns(child, next));
}

function paragraphFromElement(
  el: HTMLElement,
  extras: {
    heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel];
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    numbering?: { reference: string; level: number };
    spacing?: { before?: number; after?: number };
    indent?: { right?: number };
    border?: boolean;
  } = {},
): Paragraph {
  const runs = Array.from(el.childNodes).flatMap((child) =>
    textRuns(child, {
      bold: extras.heading !== undefined,
      size: extras.heading === HeadingLevel.HEADING_1 ? 36 : extras.heading === HeadingLevel.HEADING_2 ? 30 : extras.heading === HeadingLevel.HEADING_3 ? 26 : 24,
      color: extras.heading ? BRAND : INK,
    }),
  );

  return new Paragraph({
    bidirectional: true,
    alignment: extras.alignment ?? AlignmentType.RIGHT,
    heading: extras.heading,
    numbering: extras.numbering,
    spacing: extras.spacing ?? { after: 160 },
    indent: extras.indent,
    run: rtlRun,
    border: extras.border
      ? {
          right: { color: ACCENT, space: 8, style: BorderStyle.SINGLE, size: 12 },
        }
      : undefined,
    children: runs.length > 0 ? runs : [new TextRun({ text: '', ...rtlRun })],
  });
}

function convertTable(tableEl: HTMLTableElement): Table {
  const rows = Array.from(tableEl.rows).map((row, rowIndex) => {
    const cells = Array.from(row.cells).map((cell) => {
      const isHeader = cell.tagName.toLowerCase() === 'th' || rowIndex === 0;
      return new TableCell({
        width: { size: Math.round(9000 / Math.max(row.cells.length, 1)), type: WidthType.DXA },
        shading: isHeader
          ? { type: ShadingType.CLEAR, fill: 'E8EEF9', color: 'auto' }
          : undefined,
        children: [
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            run: rtlRun,
            children: textRuns(cell, { bold: isHeader, size: 22, color: isHeader ? BRAND : INK }),
          }),
        ],
      });
    });
    return new TableRow({ children: cells });
  });

  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    visuallyRightToLeft: true,
    rows,
  });
}

function convertBlocks(nodes: NodeListOf<ChildNode> | ChildNode[]): FileChild[] {
  const out: FileChild[] = [];

  Array.from(nodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (!text) return;
      out.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { after: 160 },
          run: rtlRun,
          children: [new TextRun({ text, font: FONT, size: 24, color: INK, rightToLeft: true, language: RTL_LANG })],
        }),
      );
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === 'h1') {
      out.push(
        paragraphFromElement(el, {
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 240, after: 160 },
        }),
      );
      return;
    }
    if (tag === 'h2') {
      out.push(
        paragraphFromElement(el, {
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 220, after: 140 },
        }),
      );
      return;
    }
    if (tag === 'h3' || tag === 'h4') {
      out.push(
        paragraphFromElement(el, {
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 180, after: 120 },
        }),
      );
      return;
    }
    if (tag === 'p' || tag === 'div') {
      if (el.children.length > 0 && !el.textContent?.trim()) {
        out.push(...convertBlocks(el.childNodes));
        return;
      }
      out.push(paragraphFromElement(el, { spacing: { after: 160 } }));
      return;
    }
    if (tag === 'blockquote') {
      out.push(
        paragraphFromElement(el, {
          indent: { right: 240 },
          border: true,
          spacing: { before: 160, after: 160 },
        }),
      );
      return;
    }
    if (tag === 'ul') {
      Array.from(el.children).forEach((li) => {
        if (li.tagName.toLowerCase() !== 'li') return;
        out.push(
          paragraphFromElement(li as HTMLElement, {
            numbering: { reference: 'contract-bullets', level: 0 },
            alignment: AlignmentType.RIGHT,
          }),
        );
      });
      return;
    }
    if (tag === 'ol') {
      Array.from(el.children).forEach((li) => {
        if (li.tagName.toLowerCase() !== 'li') return;
        out.push(
          paragraphFromElement(li as HTMLElement, {
            numbering: { reference: 'contract-numbers', level: 0 },
            alignment: AlignmentType.RIGHT,
          }),
        );
      });
      return;
    }
    if (tag === 'table') {
      out.push(convertTable(el as HTMLTableElement));
      return;
    }
    if (tag === 'hr') {
      out.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 200, after: 200 },
          run: rtlRun,
          border: {
            bottom: { color: RULE, space: 1, style: BorderStyle.SINGLE, size: 6 },
          },
          children: [],
        }),
      );
      return;
    }
    if (tag === 'br') {
      out.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          run: rtlRun,
          children: [],
        }),
      );
      return;
    }

    out.push(...convertBlocks(el.childNodes));
  });

  return out;
}

export async function exportContractDocx(options: ExportContractDocxOptions): Promise<void> {
  const title = options.title.trim() || 'مسودة عقد';
  const raw = options.content?.trim();
  if (!raw) {
    throw new Error('لا يوجد محتوى لتصديره');
  }

  const bodyHtml = markdownToHtml(raw);
  const parsed = new DOMParser().parseFromString(`<div id="lm-docx-root">${bodyHtml}</div>`, 'text/html');
  const root = parsed.getElementById('lm-docx-root');
  if (!root) {
    throw new Error('تعذّر تجهيز مستند التصدير');
  }

  const children = convertBlocks(root.childNodes);
  if (children.length === 0) {
    throw new Error('لا يوجد محتوى لتصديره');
  }

  const headingRtl = {
    paragraph: { alignment: AlignmentType.RIGHT },
    run: { ...rtlRun, bold: true, color: BRAND },
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            ...rtlRun,
            size: 24,
            color: INK,
          },
          paragraph: {
            alignment: AlignmentType.RIGHT,
          },
        },
        heading1: headingRtl,
        heading2: headingRtl,
        heading3: headingRtl,
        title: headingRtl,
        listParagraph: {
          paragraph: { alignment: AlignmentType.RIGHT },
          run: rtlRun,
        },
      },
    },
    numbering: {
      config: [
        {
          reference: 'contract-bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.RIGHT,
              style: {
                run: rtlRun,
                paragraph: { alignment: AlignmentType.RIGHT },
              },
            },
          ],
        },
        {
          reference: 'contract-numbers',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.RIGHT,
              style: {
                run: rtlRun,
                paragraph: { alignment: AlignmentType.RIGHT },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 864, bottom: 720, left: 864 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${sanitizeFileName(options.fileName || title)}.docx`);
}
