'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function AuthBrandPanel() {
  const { t } = useLanguage();

  return (
    <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0b1326] flex-col justify-between p-12 xl:p-16 text-[#dae2fd]">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand/25 via-transparent to-accent/10 pointer-events-none" />
      <div className="absolute top-1/4 start-1/4 w-[400px] h-[400px] rounded-full bg-brand/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 end-1/4 w-[300px] h-[300px] rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10">
        <span className="text-lg font-bold tracking-tight text-white">
          {t.common.brandName}
          <span className="text-accent ms-1">{t.common.brandSuffix}</span>
        </span>
      </div>

      <div className="relative z-10 my-auto max-w-md space-y-6 text-start">
        <span className="text-5xl text-brand/80 font-serif leading-none" aria-hidden>
          “
        </span>
        <blockquote className="text-2xl xl:text-3xl font-medium leading-relaxed text-[#dae2fd] -mt-4">
          {t.auth.brandQuote}
        </blockquote>
        <div className="border-t border-white/10 pt-5">
          <cite className="not-italic font-semibold text-sm tracking-wider text-accent block">
            {t.auth.brandCite}
          </cite>
          <span className="text-xs text-[#c4c6cf] tracking-wider">{t.auth.brandCiteSub}</span>
        </div>
      </div>

      <div className="relative z-10 flex justify-between text-[10px] text-[#8e9099] tracking-wider">
        <span>{t.auth.portalVer}</span>
        <span>© 2026 LegalMind AI</span>
      </div>
    </aside>
  );
}
