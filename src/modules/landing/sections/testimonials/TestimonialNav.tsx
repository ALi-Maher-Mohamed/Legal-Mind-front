'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

type TestimonialNavProps = {
  onPrev: () => void;
  onNext: () => void;
};

export default function TestimonialNav({ onPrev, onNext }: TestimonialNavProps) {
  const { isRtl } = useLanguage();

  return (
    <div className="absolute inset-y-0 -left-4 -right-4 flex items-center justify-between pointer-events-none">
      <button
        onClick={onPrev}
        className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer pointer-events-auto select-none active:scale-95"
      >
        {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
      <button
        onClick={onNext}
        className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer pointer-events-auto select-none active:scale-95"
      >
        {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
    </div>
  );
}
