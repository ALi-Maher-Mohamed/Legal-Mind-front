'use client';

import { ArrowRight } from 'lucide-react';
import type { ContractTemplate } from '@/types/drafter.types';
import { drafterCopy as c } from '../../data/drafterCopy';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  template: ContractTemplate;
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export default function WizardView({ template, values, onChange, onBack, onSubmit }: Props) {
  return (
    <div className={`${dashPanel} mx-auto w-full max-w-2xl p-4 sm:p-6 md:p-8`}>
      <div className="mb-5 flex flex-col gap-2 border-b border-brand/10 pb-4 dark:border-white/10 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted hover:text-foreground cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          {c.backLibrary}
        </button>
        <span className="text-[11px] font-bold uppercase text-muted sm:text-xs">{c.wizardSetup}</span>
      </div>

      <div className="mb-5 sm:mb-6">
        <span className="block text-[11px] font-bold uppercase tracking-widest text-brand sm:text-xs">
          {c.params}
        </span>
        <h3 className="mt-1 text-lg font-bold uppercase leading-snug text-foreground sm:text-xl md:text-2xl">
          {c.setupOf}: {template.name}
        </h3>
        <p className="mt-1 text-xs italic leading-relaxed text-muted">{c.wizardHint}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-6"
      >
        <div className="space-y-5">
          {template.variables.map((v) => (
            <div key={v.name} className="space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-muted">{v.label}</label>
              {v.type === 'select' ? (
                <select
                  value={values[v.name] || ''}
                  onChange={(e) => onChange(v.name, e.target.value)}
                  className="w-full border-b-2 border-brand/20 bg-transparent py-2 text-sm text-foreground focus:border-accent focus:outline-none dark:border-white/20"
                >
                  <option value="">{c.chooseOption}</option>
                  {v.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={values[v.name] || ''}
                  onChange={(e) => onChange(v.name, e.target.value)}
                  placeholder={v.placeholder}
                  className="w-full border-b-2 border-brand/20 bg-transparent py-2 text-sm text-foreground placeholder:italic placeholder:text-muted focus:border-accent focus:outline-none dark:border-white/20"
                />
              )}
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-brand py-3.5 text-xs font-bold uppercase tracking-widest text-on-brand hover:opacity-90 cursor-pointer"
        >
          {c.compile}
        </button>
      </form>
    </div>
  );
}
