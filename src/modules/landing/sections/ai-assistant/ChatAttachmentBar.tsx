'use client';

import { FileText, X } from 'lucide-react';
import { Attachment } from '@/types/chat.types';

type ChatAttachmentBarProps = {
  files: Attachment[];
  onRemove: () => void;
};

export default function ChatAttachmentBar({ files, onRemove }: ChatAttachmentBarProps) {
  if (files.length === 0) return null;

  return (
    <div className="px-5 py-2.5 bg-black/30 border-t border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-blue-400">
        <FileText className="h-4 w-4" />
        <span className="truncate max-w-[200px]">{files[0].name}</span>
        <span className="text-[10px] text-gray-500">({(files[0].size / 1024).toFixed(1)} KB)</span>
      </div>
      <button onClick={onRemove} className="p-1 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
