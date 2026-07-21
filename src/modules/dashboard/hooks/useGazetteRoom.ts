'use client';

import { useCallback, useMemo, useState } from 'react';
import type { GazetteDocument, UploadPayload } from '@/types/gazette.types';
import { GAZETTE_DOCUMENTS } from '../data/gazetteDocuments.data';
import { buildMockAnalysis } from '../lib/buildMockAnalysis';
import { filterGazetteDocs } from '../lib/filterGazetteDocs';

export function useGazetteRoom() {
  const [documents, setDocuments] = useState<GazetteDocument[]>(GAZETTE_DOCUMENTS);
  const [activeDoc, setActiveDoc] = useState<GazetteDocument | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const filteredDocs = useMemo(
    () => filterGazetteDocs(documents, searchQuery, filterType),
    [documents, searchQuery, filterType],
  );

  const uploadDocument = useCallback(async (payload: UploadPayload) => {
    const doc: GazetteDocument = {
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

  const openAudit = useCallback((doc: GazetteDocument) => {
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
