'use client';

import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import HeroFloatingCards from './HeroFloatingCards';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#090909]">
      <HeroBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <HeroContent />
          <HeroFloatingCards />
        </div>
      </div>
    </section>
  );
}
