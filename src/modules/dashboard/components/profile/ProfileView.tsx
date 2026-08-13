'use client';

import { useRef, useState } from 'react';
import type { AuthUser } from '@/types/auth.types';
import { useProfileActions } from './hooks/useProfileActions';
import { profilePage } from './lib/profileStyles';
import ProfileActivityCard from './ProfileActivityCard';
import ProfileBillingCard from './ProfileBillingCard';
import ProfileBookmarksCard from './ProfileBookmarksCard';
import ProfileMyBlogsCard from './ProfileMyBlogsCard';
import ProfilePaymentHistoryCard from './ProfilePaymentHistoryCard';
import ProfileDetailsCard, {
  type ProfileDetailsHandle,
} from './ProfileDetailsCard';
import ProfileHero from './ProfileHero';
import ProfileSecurityCard from './ProfileSecurityCard';

type Props = {
  user: AuthUser;
  onUserUpdate: (user: AuthUser) => void;
};

export default function ProfileView({ user, onUserUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const detailsRef = useRef<ProfileDetailsHandle>(null);
  const {
    isSaving,
    isUploadingAvatar,
    logoutAllOpen,
    isLoggingOutAll,
    setLogoutAllOpen,
    saveProfile,
    uploadAvatar,
    logoutAllDevices,
  } = useProfileActions(onUserUpdate);

  return (
    <div className={profilePage}>
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <ProfileHero
          user={user}
          editing={editing}
          isSaving={isSaving}
          isUploadingAvatar={isUploadingAvatar}
          onEditProfile={() => setEditing(true)}
          onSaveProfile={() => {
            void detailsRef.current?.save();
          }}
          onAvatarSelected={(file) => void uploadAvatar(file)}
        />

        <section className="grid items-start gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <ProfileDetailsCard
              ref={detailsRef}
              user={user}
              isSaving={isSaving}
              editing={editing}
              onEditingChange={setEditing}
              onSave={(draft) => saveProfile(draft)}
            />
          </div>

          <aside className="lg:col-span-1">
            <ProfileActivityCard user={user} />
          </aside>
        </section>

        <ProfileMyBlogsCard />

        <ProfileBillingCard />

        <ProfilePaymentHistoryCard />

        <ProfileBookmarksCard />

        <ProfileSecurityCard
          logoutAllOpen={logoutAllOpen}
          isLoggingOutAll={isLoggingOutAll}
          onOpenLogoutAll={() => setLogoutAllOpen(true)}
          onCloseLogoutAll={() => {
            if (!isLoggingOutAll) setLogoutAllOpen(false);
          }}
          onConfirmLogoutAll={() => void logoutAllDevices()}
        />
      </div>
    </div>
  );
}
