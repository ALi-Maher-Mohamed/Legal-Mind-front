'use client';

import { CalendarClock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { AuthUser } from '@/types/auth.types';
import { formatProfileDate } from '../../lib/profileLabels';
import ProfileField from './ProfileField';
import ProfileSection from './ProfileSection';

type Props = {
  user: AuthUser;
};

export default function ProfileActivityCard({ user }: Props) {
  const { t } = useLanguage();

  return (
    <ProfileSection
      title={t.dashboard.profileActivity}
      icon={CalendarClock}
      iconClassName="text-accent"
    >
      <div className="space-y-3">
        <ProfileField
          label={t.dashboard.profileLastLogin}
          value={formatProfileDate(user.lastLogin)}
        />
        <ProfileField
          label={t.dashboard.profileCreatedAt}
          value={formatProfileDate(user.createdAt)}
        />
        <ProfileField
          label={t.dashboard.profileUpdatedAt}
          value={formatProfileDate(user.updatedAt)}
        />
      </div>
    </ProfileSection>
  );
}
