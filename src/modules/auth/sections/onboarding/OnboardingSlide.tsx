'use client';

import type { OnboardingSlideKey } from '../../data/onboarding.data';

type Props = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  slideKey: OnboardingSlideKey;
  step: number;
  total: number;
};

const SLIDE_ACCENT: Record<OnboardingSlideKey, string> = {
  aiCounsel: 'from-brand/20 via-[#f0f4ff] to-accent/10',
  docAudit: 'from-accent/15 via-[#f0f4ff] to-brand/15',
  firmBrand: 'from-brand/15 via-white to-brand/10',
};

export default function OnboardingSlide({ title, desc, icon, slideKey, step, total }: Props) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-brand/15 bg-white shadow-[0_8px_28px_rgba(0,62,199,0.1)] dark:border-white/10 dark:bg-[rgba(23,31,51,0.9)] dark:shadow-none dark:backdrop-blur-md`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${SLIDE_ACCENT[slideKey]} opacity-90 dark:opacity-30 pointer-events-none`} />
      <div className="absolute inset-y-0 start-0 w-1.5 bg-brand" />
      <div className="absolute -top-16 -end-16 h-40 w-40 rounded-full bg-brand/10 blur-2xl pointer-events-none dark:bg-brand/20" />
      <div className="absolute -bottom-12 -start-8 h-28 w-28 rounded-full bg-accent/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-6 py-8 text-center md:px-10 md:py-10">
        <span className="mb-5 inline-flex items-center rounded-full border border-brand/20 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand dark:border-brand/30 dark:bg-white/5">
          {step} / {total}
        </span>

        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-brand/20 bg-white text-brand shadow-[0_4px_16px_rgba(0,62,199,0.12)] dark:border-brand/30 dark:bg-brand/20 dark:shadow-none">
          {icon}
        </div>

        <h2 className="mb-3 max-w-md text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {title}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted md:text-[15px]">{desc}</p>
      </div>
    </article>
  );
}
