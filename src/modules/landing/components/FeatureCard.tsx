// src/modules/landing/components/FeatureCard.tsx
import React from 'react';

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
}

export default function FeatureCard({ title, icon }: FeatureCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 shadow-sm p-5 rounded-2xl flex items-center gap-4 hover:border-slate-700 transition group cursor-pointer">
      <div className="p-3 bg-slate-800 text-slate-100 rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm md:text-base font-medium text-slate-100 group-hover:text-slate-200 transition">
        {title}
      </span>
    </div>
  );
}