'use client';

import { Search } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

type FAQSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function FAQSearch({ value, onChange }: FAQSearchProps) {
  const { t } = useLanguage();

  return (
    <div className="relative mb-8 max-w-xl mx-auto">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-500">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.common.searchPlaceholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 ps-10 pe-4 py-3 text-xs sm:text-sm text-white text-start placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
