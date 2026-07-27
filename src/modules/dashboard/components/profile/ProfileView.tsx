"use client";

import type { AuthUser } from "@/types/auth.types";
import { useProfileActions } from "./hooks/useProfileActions";
import ProfileActivityCard from "./ProfileActivityCard";
import ProfileContactStrip from "./ProfileContactStrip";
import ProfileDetailsCard from "./ProfileDetailsCard";
import ProfileDocumentCard from "./ProfileDocumentCard";
import ProfileHero from "./ProfileHero";
import ProfileSecurityCard from "./ProfileSecurityCard";

type Props = {
  user: AuthUser;
  onUserUpdate: (user: AuthUser) => void;
};

export default function ProfileView({ user, onUserUpdate }: Props) {
  const {
    isRefreshing,
    logoutAllOpen,
    isLoggingOutAll,
    setLogoutAllOpen,
    refreshProfile,
    logoutAllDevices,
  } = useProfileActions(onUserUpdate);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <ProfileHero
        user={user}
        isRefreshing={isRefreshing}
        onRefresh={() => void refreshProfile()}
      />

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
        <ProfileDetailsCard user={user} />
        <div className="space-y-5">
          <ProfileDocumentCard user={user} />
          <ProfileActivityCard user={user} />
        </div>
      </section>

      <ProfileContactStrip user={user} />

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
  );
}
