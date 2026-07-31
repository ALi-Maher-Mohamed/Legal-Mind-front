'use client';

import { Newspaper } from 'lucide-react';
import { gazetteCopy as c } from '../../../data/gazetteCopy';

type Props = {
  title: string;
  subtitle: string;
};

export default function CreateBlogHeader({ title, subtitle }: Props) {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-[#002045] px-5 py-7 text-white sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(254,212,136,0.18),transparent_45%)]" />
      <div className="relative">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-[#fed488]/20 px-2 py-1 text-[11px] font-bold text-[#fed488]">
          <Newspaper className="h-3.5 w-3.5" />
          {c.eyebrow}
        </span>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-xl text-sm text-white/80">{subtitle}</p>
      </div>
    </header>
  );
}
