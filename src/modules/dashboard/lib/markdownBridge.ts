import { marked } from 'marked';
import TurndownService from 'turndown';

marked.setOptions({
  gfm: true,
  breaks: true,
});

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
  strongDelimiter: '**',
});

turndown.addRule('underline', {
  filter: ['u'],
  replacement: (content) => `<u>${content}</u>`,
});

turndown.addRule('highlight', {
  filter: (node) =>
    node.nodeName === 'MARK' ||
    (node.nodeName === 'SPAN' &&
      typeof (node as HTMLElement).style?.backgroundColor === 'string' &&
      Boolean((node as HTMLElement).style.backgroundColor)),
  replacement: (content) => `==${content}==`,
});

turndown.keep(['u', 'mark']);

/** Detect whether content is mostly HTML (from TipTap) vs Markdown. */
function looksLikeHtml(value: string): boolean {
  const trimmed = value.trim();
  return /^<[a-z][\s\S]*>/i.test(trimmed);
}

function preprocessMarkdown(markdown: string): string {
  // TipTap highlight round-trip: ==text== → <mark>text</mark>
  return markdown.replace(/==([^=\n]+)==/g, '<mark>$1</mark>');
}

export function markdownToHtml(markdown: string): string {
  const source = markdown?.trim() ? markdown : '';
  if (!source) return '<p></p>';
  if (looksLikeHtml(source)) return source;
  return marked.parse(preprocessMarkdown(source), { async: false }) as string;
}

export function htmlToMarkdown(html: string): string {
  if (!html?.trim() || html === '<p></p>') return '';
  return turndown.turndown(html).trim();
}
