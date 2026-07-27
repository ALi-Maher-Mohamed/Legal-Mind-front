'use client';

import { useCallback, useState } from 'react';
import type { UploadPayload } from '@/types/analysis.types';
import toast from 'react-hot-toast';
import { analysisCopy as c } from '../data/analysisCopy';

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.txt'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type Options = {
  onUpload: (payload: UploadPayload) => Promise<void>;
};

function hasAllowedExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function useAnalysisUpload({ onUpload }: Options) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingName, setUploadingName] = useState('');

  const processFile = useCallback(
    async (file: File) => {
      if (!hasAllowedExtension(file.name)) {
        toast.error(c.uploadTypeError);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(c.uploadSizeError);
        return;
      }

      setUploadingName(file.name);
      setUploadProgress(15);

      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null || prev >= 85) return prev;
          return prev + 10;
        });
      }, 250);

      try {
        await onUpload({ file });
        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(null);
          setUploadingName('');
        }, 400);
      } catch {
        setUploadProgress(null);
        setUploadingName('');
      } finally {
        clearInterval(progressTimer);
      }
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
      e.target.value = '';
    },
  };
}
