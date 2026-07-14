'use client';

import { Star } from 'lucide-react';
import { Card } from '@/components/ui';

type TestimonialSlideProps = {
  text: string;
  name: string;
  role: string;
  avatar: string;
};

export default function TestimonialSlide({ text, name, role, avatar }: TestimonialSlideProps) {
  return (
    <Card
      glowColor="rgba(59, 130, 246, 0.2)"
      className="p-8 md:p-12 border border-white/5 bg-[#181818]/60 flex flex-col items-center text-center gap-6"
    >
      <div className="flex items-center gap-1 text-[#F6C453]">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-current" />
        ))}
      </div>
      <p className="text-base md:text-xl font-medium text-gray-200 leading-relaxed max-w-2xl">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex items-center gap-4 mt-4">
        <div className="h-12 w-12 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm shadow-[0_0_12px_rgba(59,130,246,0.2)] select-none">
          {avatar}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-white">{name}</span>
          <span className="text-xs text-gray-500">{role}</span>
        </div>
      </div>
    </Card>
  );
}
