// src/modules/landing/components/Features.tsx
import React from 'react';
import FeatureCard from './FeatureCard';

// 1. استيراد الأيقونات اللي محتاجينها من المكتبة
import { Shield, Rocket, Cpu, Globe } from 'lucide-react'; 

const FEATURES_DATA = [
  {
    id: 1,
    title: "حماية وأمان عالي",
    // 2. بنمرر الأيقونة كـ Component وبنديلها حجم (Width & Height)
    icon: <Shield className="w-6 h-6" />, 
  },
  {
    id: 2,
    title: "سرعة فائقة في الأداء",
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "تقنيات ذكاء اصطناعي",
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    id: 4,
    title: "دعم لجميع دول العالم",
    icon: <Globe className="w-6 h-6" />,
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES_DATA.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            icon={feature.icon}
          />
        ))}
      </div>
    </section>
  );
}