'use client';

type TestimonialDotsProps = {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function TestimonialDots({ total, activeIndex, onSelect }: TestimonialDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`h-2 rounded-full transition-all duration-350 cursor-pointer ${
            activeIndex === idx ? 'w-6 bg-blue-500' : 'w-2 bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}
