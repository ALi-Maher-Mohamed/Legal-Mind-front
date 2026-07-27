'use client';

import { Briefcase, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';
import { dashPanel } from '../../lib/panelStyles';

type Props = {
  user: AuthUser;
};

function ContactItem({
  icon: Icon,
  label,
  value,
  dir = 'auto',
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  dir?: 'rtl' | 'ltr' | 'auto';
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#f0f4ff] px-4 py-3 dark:bg-white/5">
      <Icon className="h-4 w-4 text-brand" />
      <div className="min-w-0 text-start">
        <p className="text-[11px] text-muted">{label}</p>
        <p className="truncate text-sm font-medium text-foreground" dir={dir}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ProfileContactStrip({ user }: Props) {
  const { t } = useLanguage();

  return (
    <section className={`${dashPanel} p-5 sm:p-6`}>
      <div className="grid gap-3 sm:grid-cols-3">
        <ContactItem
          icon={Mail}
          label={t.dashboard.profileEmail}
          value={user.email}
          dir="ltr"
        />
        <ContactItem
          icon={Phone}
          label={t.dashboard.profilePhone}
          value={user.phone || '—'}
          dir="ltr"
        />
        <ContactItem
          icon={Briefcase}
          label={t.dashboard.profileOffice}
          value={user.firmName || '—'}
        />
      </div>
    </section>
  );
}
