import { marked } from 'marked';
import { looksLikeHtml } from './blogHelpers';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export { looksLikeHtml };

/** Convert plain/markdown blog content into HTML for TipTap. */
export function markdownToHtmlSafe(value?: string) {
  const source = value?.trim() ? value : '';
  if (!source) return '<p></p>';
  if (looksLikeHtml(source)) return source;
  return marked.parse(source, { async: false }) as string;
}
