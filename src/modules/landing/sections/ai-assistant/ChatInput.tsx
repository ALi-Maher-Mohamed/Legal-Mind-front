'use client';

import { Send, Paperclip } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

type ChatInputProps = {
  inputValue: string;
  hasAttachment: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  onFileTrigger: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ChatInput({
  inputValue,
  hasAttachment,
  fileInputRef,
  onInputChange,
  onKeyDown,
  onSend,
  onFileTrigger,
  onFileChange,
}: ChatInputProps) {
  const { t } = useLanguage();

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={onFileChange} accept=".pdf,.doc,.docx,.txt" className="hidden" />
      <div className="px-5 py-4 border-t border-white/5 bg-[#181818]/60 flex items-center gap-3">
        <button
          onClick={onFileTrigger}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition cursor-pointer"
          title={t.common.uploadFile}
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            hasAttachment ? t.aiPreview.uploadSuccess : 'اطرح سؤالك أو اكتب رسالتك هنا...'
          }
          dir="rtl"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={onSend}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)] transition cursor-pointer active:scale-95"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
