'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function ChatHeader() {
  const { t } = useLanguage();

  return (
    <div className="px-5 py-4 border-b border-white/5 bg-[#181818]/80 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-8.5 w-8.5 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
            <svg className="h-4.5 w-4.5" viewBox="0 0 100 100" fill="none">
              <path d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z" stroke="currentColor" strokeWidth="8" />
            </svg>
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-black animate-pulse" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-white">{t.aiPreview.chatHeader}</span>
          <span className="text-[10px] text-gray-500">{t.aiPreview.onlineStatus}</span>
        </div>
      </div>
    </div>
  );
}
