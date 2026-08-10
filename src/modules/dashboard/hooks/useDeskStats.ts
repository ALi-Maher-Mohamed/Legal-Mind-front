'use client';

import { useEffect, useState } from 'react';
import { analyzeService } from '@/services/analyze.service';
import { conversationsService } from '@/services/conversations.service';
import { generateService } from '@/services/generate.service';

export type DeskStats = {
  analyzedTotal: number;
  conversationsTotal: number;
  draftsTotal: number;
  isLoading: boolean;
};

export function useDeskStats(): DeskStats {
  const [analyzedTotal, setAnalyzedTotal] = useState(0);
  const [conversationsTotal, setConversationsTotal] = useState(0);
  const [draftsTotal, setDraftsTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      try {
        const [analyzeCount, generateCount, conversations] = await Promise.all([
          analyzeService.countJobs().catch(() => 0),
          generateService.countJobs().catch(() => 0),
          conversationsService
            .list({ status: 'active', limit: 100 })
            .then((res) => res.conversations.length)
            .catch(() => 0),
        ]);

        if (!active) return;
        setAnalyzedTotal(analyzeCount);
        setDraftsTotal(generateCount);
        setConversationsTotal(conversations);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return {
    analyzedTotal,
    conversationsTotal,
    draftsTotal,
    isLoading,
  };
}
