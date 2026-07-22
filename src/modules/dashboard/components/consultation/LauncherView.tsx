'use client';

import { History, Scale } from 'lucide-react';
import type { ContextType, Conversation } from '@/types/consultation.types';
import { consultCopy as c } from '../../data/consultCopy';
import ContextCard from './ContextCard';

const TYPES: ContextType[] = ['general', 'firm', 'case', 'kb'];

type Props = {
  conversations: Conversation[];
  onCreate: (type: ContextType) => void;
  onOpenHistory: () => void;
};

export default function LauncherView({ conversations, onCreate, onOpenHistory }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="mb-10 max-w-xl text-center sm:mb-12">
        <Scale className="mx-auto mb-4 h-12 w-12 text-accent" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{c.title}</h2>
        <p className="mt-1 text-sm text-muted">{c.subtitle}</p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {TYPES.map((type) => (
          <ContextCard key={type} type={type} onSelect={onCreate} />
        ))}
      </div>

      {conversations.length > 0 && (
        <button
          type="button"
          onClick={onOpenHistory}
          className="mt-8 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand hover:opacity-80 cursor-pointer"
        >
          <History className="h-4 w-4" strokeWidth={2} />
          {c.reviewHistory} ({conversations.length})
        </button>
      )}
    </div>
  );
}
