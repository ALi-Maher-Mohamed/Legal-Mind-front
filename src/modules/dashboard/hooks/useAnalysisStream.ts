'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { analyzeService } from '@/services/analyze.service';
import type { AnalysisDocument, ProgressLog } from '@/types/analysis.types';
import { STAGE_NAMES, stageLabel, stepProgress } from '../lib/analyzeMappers';

export type StreamStepKey = '0/7' | '1/7' | '2/7' | '3/7' | '4/7' | '5/7' | '6/7' | '7/7';

export const STREAM_STEPS: StreamStepKey[] = [
  '0/7',
  '1/7',
  '2/7',
  '3/7',
  '4/7',
  '5/7',
  '6/7',
  '7/7',
];

export type StreamStepState = 'pending' | 'active' | 'done' | 'error';

function stepIndex(step?: string): number {
  if (!step || step === 'error') return -1;
  const num = parseInt(step.split('/')[0] ?? '', 10);
  return Number.isNaN(num) ? -1 : num;
}

function logKey(log: ProgressLog) {
  return `${log.step}|${log.phase}|${log.timestamp}|${log.message.slice(0, 40)}`;
}

export function useAnalysisStream(doc: AnalysisDocument | null, open: boolean) {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [liveMessage, setLiveMessage] = useState('');
  const [currentStep, setCurrentStep] = useState<string | undefined>(doc?.currentStep);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    if (!open || !doc) return;

    const controller = new AbortController();
    seen.current = new Set();
    setLogs([]);
    setLiveMessage(doc.currentStage || 'جاري الاتصال ببث التحليل...');
    setCurrentStep(doc.currentStep);
    setFailed(doc.status === 'failed');
    setDone(doc.status === 'completed');
    setConnecting(true);

    const pushLog = (event: ProgressLog) => {
      const key = logKey(event);
      if (seen.current.has(key)) return;
      seen.current.add(key);

      setLogs((prev) => [...prev, event]);
      setLiveMessage(event.message);
      if (event.step !== 'error') setCurrentStep(event.step);

      if (event.step === 'error' || (event.step === '7/7' && event.phase === 'done')) {
        setFailed(event.step === 'error');
        setDone(event.step === '7/7');
      }
    };

    const bootstrap = async () => {
      try {
        const progress = await analyzeService.getProgress(doc.id);
        progress.logs.forEach(pushLog);
      } catch {
        // stream will still try
      }

      try {
        await analyzeService.streamProgress(doc.id, {
          signal: controller.signal,
          onEvent: pushLog,
          onError: () => setConnecting(false),
        });
      } catch {
        if (!controller.signal.aborted) setConnecting(false);
        return;
      } finally {
        if (!controller.signal.aborted) setConnecting(false);
      }
    };

    void bootstrap();

    return () => controller.abort();
  }, [open, doc?.id]);

  const progress = useMemo(() => {
    if (failed) return doc?.progress ?? stepProgress(currentStep) ?? 0;
    if (done) return 100;
    return stepProgress(currentStep) ?? doc?.progress ?? 0;
  }, [currentStep, doc?.progress, done, failed]);

  const steps = useMemo(() => {
    const activeIdx = stepIndex(currentStep);
    return STREAM_STEPS.map((step, index) => {
      let state: StreamStepState = 'pending';
      if (failed && activeIdx >= 0 && index === activeIdx) state = 'error';
      else if (failed && activeIdx >= 0 && index < activeIdx) state = 'done';
      else if (done || index < activeIdx) state = 'done';
      else if (index === activeIdx) state = failed ? 'error' : 'active';
      else if (currentStep === '7/7' && index === 7) state = done ? 'done' : 'active';

      return {
        step,
        label: STAGE_NAMES[step] ?? stageLabel(step) ?? step,
        state,
      };
    });
  }, [currentStep, done, failed]);

  const displayLogs = useMemo(() => {
    return [...logs].reverse();
  }, [logs]);

  return {
    logs: displayLogs,
    liveMessage,
    currentStep,
    progress,
    steps,
    failed,
    done,
    connecting,
  };
}
