'use client';

import { IdCard } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';
import { roleLabel, teamSizeLabel } from '../../lib/profileLabels';
import ProfileField from './ProfileField';
import ProfileSection from './ProfileSection';

type Props = {
  user: AuthUser;
};

export default function ProfileDetailsCard({ user }: Props) {
  const { t } = useLanguage();

  return (
    <ProfileSection title={t.dashboard.profileDetails} icon={IdCard}>
      <div className="grid gap-3 sm:grid-cols-2">
        <ProfileField label={t.dashboard.profileFullName} value={user.name} />
        <ProfileField label={t.dashboard.profileEmail} value={user.email} dir="ltr" />
        <ProfileField label={t.dashboard.profilePhone} value={user.phone || '—'} dir="ltr" />
        <ProfileField label={t.dashboard.profileOffice} value={user.firmName} />
        <ProfileField label={t.dashboard.profileBarId} value={user.barId || '—'} dir="ltr" />
        <ProfileField
          label={t.dashboard.profileTeamSize}
          value={teamSizeLabel(user.teamSize)}
        />
        <ProfileField label={t.dashboard.profileRole} value={roleLabel(user.role)} />
        <ProfileField label={t.dashboard.profileUserId} value={user.id} dir="ltr" />
      </div>
    </ProfileSection>
  );
}
