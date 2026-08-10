import {
  Bookmark,
  FileSearch,
  FilePenLine,
  MessageCircle,
  MessageSquareText,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';
import type { DashboardActivityRecord } from '@/types/dashboard.types';

type Props = {
  record: DashboardActivityRecord;
  expanded: boolean;
  expandLabel: string;
  collapseLabel: string;
  onToggle: () => void;
};

const TYPE_META: Record<
  string,
  { label: string; icon: LucideIcon; tone: string }
> = {
  conversation: {
    label: 'محادثة',
    icon: MessageSquareText,
    tone: 'text-brand bg-brand/10 border-brand/15 dark:bg-brand/20',
  },
  generation: {
    label: 'صياغة',
    icon: FilePenLine,
    tone: 'text-[#0d6e63] bg-[#44e2cd]/15 border-[#44e2cd]/30 dark:text-[#f2c14e] dark:bg-[#f2c14e]/10 dark:border-[#f2c14e]/25',
  },
  comment: {
    label: 'تعليق',
    icon: MessageCircle,
    tone: 'text-accent bg-accent/15 border-accent/30',
  },
  blog: {
    label: 'مقال',
    icon: Newspaper,
    tone: 'text-brand bg-brand/10 border-brand/15 dark:bg-brand/20',
  },
  analysis: {
    label: 'تحليل',
    icon: FileSearch,
    tone: 'text-danger bg-danger/10 border-danger/20',
  },
  bookmark: {
    label: 'مفضلة',
    icon: Bookmark,
    tone: 'text-accent bg-accent/15 border-accent/30',
  },
};

function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function metadataLines(metadata?: Record<string, unknown>) {
  if (!metadata) return [];
  return Object.entries(metadata)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}: ${String(value)}`);
}

export default function ActivityItem({
  record,
  expanded,
  expandLabel,
  collapseLabel,
  onToggle,
}: Props) {
  const meta = TYPE_META[record.type] ?? {
    label: record.type,
    icon: Newspaper,
    tone: 'text-muted bg-surface-raised border-brand/12 dark:border-white/10',
  };
  const Icon = meta.icon;
  const time = formatTime(record.timestamp);
  const detailLines = metadataLines(record.metadata);
  const canExpand = detailLines.length > 0;

  const body = (
    <>
      <span
        className={`absolute -start-[1.4rem] top-4 flex h-5 w-5 items-center justify-center rounded-full border border-brand/20 bg-card text-brand dark:border-white/15 dark:bg-[#101a30] ${canExpand ? 'group-hover:border-accent group-hover:text-accent' : ''}`}
      >
        <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
      </span>

      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border sm:flex ${meta.tone}`}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${meta.tone}`}
            >
              {meta.label}
            </span>
            {time ? (
              <span className="text-[11px] font-medium text-muted">{time}</span>
            ) : null}
            {canExpand ? (
              <span className="ms-auto text-[10px] text-muted group-hover:text-foreground">
                {expanded ? collapseLabel : expandLabel}
              </span>
            ) : null}
          </div>

          <h3 className="mt-1.5 text-sm font-bold leading-snug text-foreground">
            {record.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
            {record.description}
          </p>

          {expanded && detailLines.length > 0 ? (
            <div className="mt-2.5 rounded-lg border border-brand/12 border-s-2 border-s-accent bg-surface-raised/80 p-2.5 text-[11px] leading-relaxed text-foreground dark:border-white/10 dark:bg-white/5">
              <ul className="space-y-1">
                {detailLines.map((line) => (
                  <li key={line} className="break-words">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );

  if (!canExpand) {
    return (
      <div className="relative rounded-xl border border-brand/10 bg-surface-raised/40 px-3 py-3 dark:border-white/10 dark:bg-white/5">
        {body}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="group relative block w-full cursor-pointer rounded-xl border border-brand/10 bg-surface-raised/40 px-3 py-3 text-start transition hover:border-brand/25 hover:bg-brand/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/15 dark:hover:bg-white/[0.07]"
      onClick={onToggle}
    >
      {body}
    </button>
  );
}
