'use client';

import { useLanguage } from '@/hooks/useLanguage';

type ChatSuggestionsProps = {
  visible: boolean;
  onSelect: (key: 'lease' | 'developer') => void;
};

export default function ChatSuggestions({ visible, onSelect }: ChatSuggestionsProps) {
  const { t } = useLanguage();
  if (!visible) return null;

  return (
    <div className="px-5 pb-3 flex flex-wrap gap-2 justify-end">
      <button
        onClick={() => onSelect('lease')}
        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-300 hover:bg-white/10 hover:border-white/20 transition cursor-pointer select-none"
      >
        {t.aiPreview.promptOne}
      </button>
      <button
        onClick={() => onSelect('developer')}
        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-300 hover:bg-white/10 hover:border-white/20 transition cursor-pointer select-none"
      >
        {t.aiPreview.promptTwo}
      </button>
    </div>
  );
}
