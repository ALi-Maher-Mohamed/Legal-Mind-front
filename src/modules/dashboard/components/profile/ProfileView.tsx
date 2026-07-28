'use client';

import { useState } from 'react';
import type { AuthUser } from '@/types/auth.types';
import { useProfileActions } from './hooks/useProfileActions';
import ProfileActivityCard from './ProfileActivityCard';
import ProfileDetailsCard from './ProfileDetailsCard';
import ProfileDocumentCard from './ProfileDocumentCard';
import ProfileHero from './ProfileHero';
import ProfileSecurityCard from './ProfileSecurityCard';

type Props = {
  user: AuthUser;
  onUserUpdate: (user: AuthUser) => void;
};

export default function ProfileView({ user, onUserUpdate }: Props) {
  const [editing, setEditing] = useState(false);
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
    <div className="-mx-4 -my-2 min-h-full bg-[#0b1326] px-4 py-6 sm:-mx-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <ProfileHero
          user={user}
          isUploadingAvatar={isUploadingAvatar}
          onEditProfile={() => setEditing(true)}
          onAvatarSelected={(file) => void uploadAvatar(file)}
        />

        <section className="grid items-start gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <ProfileDetailsCard
              user={user}
              isSaving={isSaving}
              editing={editing}
              onEditingChange={setEditing}
              onSave={(draft) => saveProfile(draft)}
            />
            <ProfileDocumentCard user={user} />
          </div>

          <aside className="lg:col-span-1">
            <ProfileActivityCard user={user} />
          </aside>
        </section>

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
