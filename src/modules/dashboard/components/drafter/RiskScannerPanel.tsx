'use client';

import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { drafterCopy as c } from '../../data/drafterCopy';
import { dashPanel } from '../../lib/panelStyles';

const RISKS = [
  {
    badge: c.risk1Badge,
    title: c.risk1Title,
    desc: c.risk1Desc,
    tone: 'border-danger/30 bg-danger/5 text-danger',
  },
  {
    badge: c.risk2Badge,
    title: c.risk2Title,
    desc: c.risk2Desc,
    tone: 'border-accent/40 bg-accent/5 text-accent',
  },
] as const;

export default function RiskScannerPanel() {
  return (
    <aside className={`${dashPanel} flex h-full flex-col justify-between overflow-hidden p-4`}>
      <div className="flex-1 space-y-4 overflow-y-auto pe-1">
        <div className="mb-1 flex items-center gap-1.5 border-b border-brand/10 pb-2 dark:border-white/10">
          <ShieldAlert className="h-4 w-4 text-danger" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{c.riskTitle}</h4>
        </div>
        <p className="text-[10px] italic leading-relaxed text-muted">{c.riskHint}</p>
        <div className="space-y-4">
          {RISKS.map((risk) => (
            <div key={risk.title} className={`rounded-xl border p-3 ${risk.tone.split(' ').slice(0, 2).join(' ')}`}>
              <div className={`mb-1 flex items-center gap-1 text-[9px] font-bold uppercase ${risk.tone.split(' ').slice(2).join(' ')}`}>
                <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.5} />
                {risk.badge}
              </div>
              <h5 className="text-xs font-bold uppercase text-foreground">{risk.title}</h5>
              <p className="mt-1 text-[10px] italic text-muted">{risk.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 border-t border-brand/10 pt-3 text-center text-[10px] leading-relaxed text-muted dark:border-white/10">
        {c.riskFooter}
      </p>
    </aside>
  );
}
