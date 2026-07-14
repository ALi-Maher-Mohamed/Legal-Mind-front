// src/modules/landing/components/FeatureCard.tsx
import React from 'react';

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
}

export default function FeatureCard({ title, icon }: FeatureCardProps) {
  return (
    <div className="bg-[#0b0f19]/60 border border-gray-800/60 backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 hover:border-gray-700 transition group cursor-pointer">
      <div className="p-3 bg-blue-950/40 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm md:text-base font-medium text-gray-200 group-hover:text-white transition">
        {title}
      </span>
    </div>
  );
}