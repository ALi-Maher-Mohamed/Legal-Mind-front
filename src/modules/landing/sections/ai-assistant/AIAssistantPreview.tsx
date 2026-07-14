'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Button, SectionTitle } from '@/components/ui';
import ChatPanel from './ChatPanel';

export default function AIAssistantPreview() {
  const { t, isRtl } = useLanguage();

  return (
    <section className="py-20 bg-[#090909] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-right gap-6">
            <SectionTitle
              badge={t.aiPreview.badge}
              title={t.aiPreview.title}
              subtitle={t.aiPreview.description}
              align={isRtl ? 'right' : 'left'}
              className="mb-0!"
            />
            <Button variant="primary" size="lg">{t.aiPreview.ctaText}</Button>
          </div>
          <div className="lg:col-span-7 w-full">
            <ChatPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
