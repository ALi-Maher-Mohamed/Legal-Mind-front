'use client';

import type { ContractTemplate, DraftOutputLang } from '@/types/drafter.types';
import type { GenerateJobListItem } from '@/types/generate.types';
import { drafterCopy as c } from '../../data/drafterCopy';
import { DRAFTER_TEMPLATES } from '../../data/drafterTemplates.data';
import AiDraftPanel from './AiDraftPanel';
import GenerationJobsPanel from './GenerationJobsPanel';
import TemplateCard from './TemplateCard';

type Props = {
  prompt: string;
  onPromptChange: (v: string) => void;
  language: DraftOutputLang;
  onLanguageChange: (v: DraftOutputLang) => void;
  isDrafting: boolean;
  draftProgress?: { progress: number; stage: string } | null;
  onAiSubmit: () => void;
  onCancelDraft?: () => void;
  onOpenWizard: (tmpl: ContractTemplate) => void;
  jobs: GenerateJobListItem[];
  isLoadingJobs: boolean;
  deletingJobId: string | null;
  onRefreshJobs: () => void;
  onOpenJob: (job: GenerateJobListItem) => void;
  onDeleteJob: (job: GenerateJobListItem) => void;
};

export default function LibraryView(props: Props) {
  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 sm:space-y-7 lg:space-y-8">
      <header className="space-y-1">
        <span className="block text-[11px] font-bold uppercase tracking-widest text-brand sm:text-xs">
          {c.eyebrow}
        </span>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
          {c.title}
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">{c.subtitle}</p>
      </header>

      <AiDraftPanel
        prompt={props.prompt}
        onPromptChange={props.onPromptChange}
        language={props.language}
        onLanguageChange={props.onLanguageChange}
        isDrafting={props.isDrafting}
        draftProgress={props.draftProgress}
        onSubmit={props.onAiSubmit}
        onCancel={props.onCancelDraft}
      />

      <GenerationJobsPanel
        jobs={props.jobs}
        isLoading={props.isLoadingJobs}
        deletingId={props.deletingJobId}
        onRefresh={props.onRefreshJobs}
        onOpen={props.onOpenJob}
        onDelete={props.onDeleteJob}
      />

      <section>
        <h3 className="mb-4 border-b border-brand/15 pb-2.5 text-base font-bold uppercase text-foreground dark:border-white/10 sm:mb-6 sm:pb-3 sm:text-lg">
          {c.templatesTitle}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 xl:grid-cols-3 xl:gap-6">
          {DRAFTER_TEMPLATES.map((tmpl) => (
            <TemplateCard key={tmpl.id} template={tmpl} onSelect={props.onOpenWizard} />
          ))}
        </div>
      </section>
    </div>
  );
}
