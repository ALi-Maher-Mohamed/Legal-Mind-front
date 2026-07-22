'use client';

import type { ContractTemplate, DraftOutputLang } from '@/types/drafter.types';
import { drafterCopy as c } from '../../data/drafterCopy';
import { DRAFTER_TEMPLATES } from '../../data/drafterTemplates.data';
import AiDraftPanel from './AiDraftPanel';
import TemplateCard from './TemplateCard';

type Props = {
  prompt: string;
  onPromptChange: (v: string) => void;
  language: DraftOutputLang;
  onLanguageChange: (v: DraftOutputLang) => void;
  isDrafting: boolean;
  onAiSubmit: () => void;
  onOpenWizard: (tmpl: ContractTemplate) => void;
};

export default function LibraryView(props: Props) {
  return (
    <div className="space-y-8">
      <header>
        <span className="block text-xs font-bold uppercase tracking-widest text-brand">{c.eyebrow}</span>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{c.title}</h2>
        <p className="mt-1 text-sm text-muted">{c.subtitle}</p>
      </header>

      <AiDraftPanel
        prompt={props.prompt}
        onPromptChange={props.onPromptChange}
        language={props.language}
        onLanguageChange={props.onLanguageChange}
        isDrafting={props.isDrafting}
        onSubmit={props.onAiSubmit}
      />

      <section>
        <h3 className="mb-6 border-b border-brand/15 pb-3 text-lg font-bold uppercase text-foreground dark:border-white/10">
          {c.templatesTitle}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {DRAFTER_TEMPLATES.map((tmpl) => (
            <TemplateCard key={tmpl.id} template={tmpl} onSelect={props.onOpenWizard} />
          ))}
        </div>
      </section>
    </div>
  );
}
