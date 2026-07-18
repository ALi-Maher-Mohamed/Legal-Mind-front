'use client';

import { Card } from '@/components/ui';

type ServiceCardProps = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  glow: string;
};

export default function ServiceCard({ title, desc, icon, glow }: ServiceCardProps) {
  return (
    <Card
      glowColor={glow}
      className="p-8 border border-white/5 bg-[#181818]/60 hover:border-white/10 flex flex-col items-start gap-4 transition duration-300 h-full group cursor-pointer"
    >
      <div className="p-3.5 bg-white/5 rounded-2xl text-gray-300 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <div className="flex flex-col gap-2 mt-2 text-start">
        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition duration-200">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition duration-200">{desc}</p>
      </div>
    </Card>
  );
}
