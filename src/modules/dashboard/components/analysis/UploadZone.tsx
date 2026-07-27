'use client';

import { Upload } from 'lucide-react';
import { analysisCopy as c } from '../../data/analysisCopy';
import { dashPanel } from '../../lib/panelStyles';
import { UploadSkeleton } from './ui/AnalysisShimmer';

type Props = {
  isDragging: boolean;
  uploadProgress: number | null;
  uploadingName: string;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function UploadZone({
  isDragging,
  uploadProgress,
  uploadingName,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: Props) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`${dashPanel} border-2 border-dashed p-6 text-center transition sm:p-8 ${
        isDragging
          ? 'border-brand bg-brand/5'
          : 'border-brand/25 dark:border-white/15'
      }`}
    >
      <input
        type="file"
        id="analysis-file-selector"
        onChange={onFileSelect}
        accept=".txt,.pdf,.docx,.png,.jpg,.jpeg,.tiff,.bmp"
        className="hidden"
      />

      {uploadProgress !== null ? (
        <div className="mx-auto max-w-sm py-2">
          <UploadSkeleton />
          <h4 className="mt-1 text-sm font-bold text-foreground">
            {c.indexing}: {uploadingName}
          </h4>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand/10 dark:bg-white/10">
            <div
              className="relative h-full overflow-hidden rounded-full bg-accent transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            >
              <span className="lm-shimmer absolute inset-0 rounded-full opacity-60" />
            </div>
          </div>
          <span className="mt-2 block text-[10px] text-muted">
            {uploadProgress}% {c.complete}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4 sm:py-6">
          <Upload className="mb-4 h-10 w-10 text-accent" strokeWidth={1.5} />
          <h4 className="text-sm font-bold text-foreground sm:text-base">{c.dropTitle}</h4>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted">{c.dropHint}</p>
          <button
            type="button"
            onClick={() => document.getElementById('analysis-file-selector')?.click()}
            className="mt-5 rounded-lg bg-brand px-5 py-2.5 text-xs font-bold text-on-brand transition hover:opacity-90 cursor-pointer"
          >
            {c.locateFile}
          </button>
        </div>
      )}
    </div>
  );
}
