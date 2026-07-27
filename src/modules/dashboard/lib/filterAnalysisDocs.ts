import type { AnalysisDocument } from '@/types/analysis.types';
import { inferDocType } from './analyzeMappers';

export { inferDocType };

export function filterAnalysisDocs(
  documents: AnalysisDocument[],
  searchQuery: string,
  filterType: string,
): AnalysisDocument[] {
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
