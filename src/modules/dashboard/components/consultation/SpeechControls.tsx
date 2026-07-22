'use client';

import { consultCopy as c } from '../../data/consultCopy';

type Props = {
  speechRate: number;
  onRateChange: (rate: number) => void;
  onStop: () => void;
};

export default function SpeechControls({ speechRate, onRateChange, onStop }: Props) {
  return (
    <div className="mt-3 flex flex-col items-center justify-between gap-2 rounded-lg border border-brand/20 bg-brand/5 p-2 sm:flex-row">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand">
        <span className="h-1.5 w-1.5 shrink-0 animate-ping rounded-full bg-brand" />
        {c.reading}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase text-muted">
            {c.speed}: {speechRate}x
          </span>
          <input
            type="range"
            min="0.6"
            max="1.3"
            step="0.05"
            value={speechRate}
            onChange={(e) => onRateChange(parseFloat(e.target.value))}
            className="h-1 w-16 cursor-pointer accent-[var(--lm-brand)]"
          />
        </div>
        <button
          type="button"
          onClick={onStop}
          className="rounded-lg bg-brand px-2 py-0.5 text-[9px] font-bold uppercase text-on-brand hover:opacity-90 cursor-pointer"
        >
          {c.stopReading}
        </button>
      </div>
    </div>
  );
}
