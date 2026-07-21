import type { GazetteDocument } from '@/types/gazette.types';

export function filterGazetteDocs(
  documents: GazetteDocument[],
  searchQuery: string,
  filterType: string,
): GazetteDocument[] {
  const q = searchQuery.trim().toLowerCase();
  return documents.filter((doc) => {
    const matchesSearch =
      !q ||
      doc.name.toLowerCase().includes(q) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(q));
    const matchesType = filterType === 'ALL' || doc.type === filterType;
    return matchesSearch && matchesType;
  });
}

export function inferDocType(fileName: string): string {
  if (fileName.endsWith('.docx')) return 'Employment';
  if (fileName.toUpperCase().includes('NDA')) return 'NDA';
  return 'Service Agreement';
}
