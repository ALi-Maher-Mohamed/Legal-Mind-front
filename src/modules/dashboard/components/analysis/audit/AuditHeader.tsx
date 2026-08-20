"use client";

import { ArrowRight, Download, ExternalLink } from "lucide-react";
import type { AnalysisDocument } from "@/types/analysis.types";
import { analysisCopy as c } from "../../../data/analysisCopy";
import toast from "react-hot-toast";

type Props = {
  doc: AnalysisDocument;
  onBack: () => void;
  onDownload: () => void;
};

export default function AuditHeader({ doc, onBack, onDownload }: Props) {
  const score = doc.result?.overall.overall_score;
  const classification = doc.result?.overall.classification;
  const resultLabel = classification
    ? c.classificationLabels[classification] ?? classification
    : typeof score === 'number'
      ? score >= 85
        ? c.classificationLabels.excellent
        : score >= 70
          ? c.classificationLabels.good
          : score >= 50
            ? c.classificationLabels.needs_review
            : score >= 30
              ? c.classificationLabels.high_risk
              : c.classificationLabels.critical
      : null;

  return (
    <div className="flex flex-col gap-4 border-b border-brand/15 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
      <div className="flex items-start gap-3 sm:items-center">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-brand/15 bg-white p-2 text-muted transition hover:border-brand hover:text-foreground dark:border-white/10 dark:bg-white/5 cursor-pointer"
          aria-label="رجوع"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase text-on-brand">
              {c.auditedBadge}
            </span>
            {resultLabel ? (
              <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                {resultLabel}
              </span>
            ) : null}
            <span className="font-mono text-xs text-muted">
              ID: {doc.id.slice(0, 8)}
            </span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
            {doc.name}
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-on-brand transition hover:opacity-90 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          {c.downloadReport}
        </button>
      </div>
    </div>
  );
}
