'use client';

import { useCallback, useState } from 'react';
import type { UploadPayload } from '@/types/analysis.types';
import { inferDocType } from '../lib/filterAnalysisDocs';

type Options = {
  onUpload: (payload: UploadPayload) => Promise<void>;
};

export function useAnalysisUpload({ onUpload }: Options) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingName, setUploadingName] = useState('');

  const processFile = useCallback(
    async (file: File) => {
      setUploadingName(file.name);
      setUploadProgress(10);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null) return 10;
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 20;
        });
      }, 200);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const content =
          (e.target?.result as string) ||
          'هذا الاتفاق ينظم شروط التعاون بين الأطراف الموقعين.';

        await onUpload({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          content,
          type: inferDocType(file.name),
        });

        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(null);
          setUploadingName('');
        }, 500);
      };
      reader.readAsText(file);
    },
    [onUpload],
  );

  return {
    isDragging,
    uploadProgress,
    uploadingName,
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void processFile(file);
    },
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void processFile(file);
    },
  };
}
