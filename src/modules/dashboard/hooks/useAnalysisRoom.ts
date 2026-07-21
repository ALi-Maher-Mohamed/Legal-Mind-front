'use client';

import { useCallback, useMemo, useState } from 'react';
import type { AnalysisDocument, UploadPayload } from '@/types/analysis.types';
import { ANALYSIS_DOCUMENTS } from '../data/analysisDocuments.data';
import { buildMockAnalysis } from '../lib/buildMockAnalysis';
import { filterAnalysisDocs } from '../lib/filterAnalysisDocs';

export function useAnalysisRoom() {
  const [documents, setDocuments] = useState<AnalysisDocument[]>(ANALYSIS_DOCUMENTS);
  const [activeDoc, setActiveDoc] = useState<AnalysisDocument | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const filteredDocs = useMemo(
    () => filterAnalysisDocs(documents, searchQuery, filterType),
    [documents, searchQuery, filterType],
  );

  const uploadDocument = useCallback(async (payload: UploadPayload) => {
    const doc: AnalysisDocument = {
      id: `doc-${Date.now()}`,
      name: payload.name,
      type: payload.type,
      size: payload.size,
      status: 'Pending Review',
      dateUploaded: 'اليوم',
      tags: ['جديد'],
      content: payload.content,
    };
    setDocuments((prev) => [doc, ...prev]);
  }, []);

  const runAudit = useCallback(async (docId: string) => {
    setAnalyzingId(docId);
    await new Promise((r) => setTimeout(r, 1200));
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, ...buildMockAnalysis(doc) } : doc,
      ),
    );
    setAnalyzingId(null);
  }, []);

  const openAudit = useCallback((doc: AnalysisDocument) => {
    setActiveDoc(doc);
    setHighlightId(null);
  }, []);

  const closeAudit = useCallback(() => {
    setActiveDoc(null);
    setHighlightId(null);
  }, []);

  return {
    documents,
    filteredDocs,
    activeDoc,
    isListView,
    setIsListView,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    analyzingId,
    highlightId,
    setHighlightId,
    uploadDocument,
    runAudit,
    openAudit,
    closeAudit,
  };
}
