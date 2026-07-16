'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function AuthBrandPanel() {
  const { t } = useLanguage();

  return (
    <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#090909] flex-col justify-between p-12 xl:p-16 text-white">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10">
        <span className="text-lg font-bold tracking-tight">
          LegalMind<span className="text-[#F6C453]">AI</span>
        </span>
      </div>

      <div className="relative z-10 my-auto max-w-md space-y-6">
        <span className="text-5xl text-blue-400/80 font-serif leading-none" aria-hidden>
          “
        </span>
        <blockquote className="text-2xl xl:text-3xl font-medium leading-relaxed text-gray-100 -mt-4">
          {t.auth.brandQuote}
        </blockquote>
        <div className="border-t border-white/10 pt-5">
          <cite className="not-italic font-semibold text-sm tracking-wider text-[#F6C453] block">
            {t.auth.brandCite}
          </cite>
          <span className="text-xs text-gray-500 tracking-wider">{t.auth.brandCiteSub}</span>
        </div>
      </div>

      <div className="relative z-10 flex justify-between text-[10px] text-gray-500 tracking-wider">
        <span>{t.auth.portalVer}</span>
        <span>© 2026 LegalMind AI</span>
      </div>
    </aside>
  );
}
