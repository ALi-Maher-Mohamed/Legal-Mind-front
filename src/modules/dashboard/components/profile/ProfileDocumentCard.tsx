"use client";

import { useState } from "react";
import { Briefcase, Expand, FileText } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { resolveMediaUrl } from "@/lib/api/media";
import type { AuthUser } from "@/types/auth.types";
import ProfileImagePreview from "./ProfileImagePreview";
import ProfileSection from "./ProfileSection";

type Props = {
  user: AuthUser;
};

export default function ProfileDocumentCard({ user }: Props) {
  const { t } = useLanguage();
  const [failedPath, setFailedPath] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const documentUrl = resolveMediaUrl(user.lawyerIdDocument);
  const docFailed = failedPath === (user.lawyerIdDocument || null);
  const canPreview = Boolean(documentUrl && !docFailed);

  return (
    <>
      <ProfileSection title={t.dashboard.profileIdDocument} icon={FileText}>
        {canPreview && documentUrl ? (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="group relative block w-full overflow-hidden rounded-xl border border-brand/10 text-start transition hover:border-brand/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:border-white/10 cursor-pointer"
            aria-label={t.dashboard.profilePreviewCta}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={documentUrl}
              alt={t.dashboard.profileIdDocument}
              className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              onError={() => setFailedPath(user.lawyerIdDocument || null)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326]/70 via-[#0b1326]/10 to-transparent opacity-80 transition group-hover:opacity-100" />
          </button>
        ) : (
          <div className="flex h-52 flex-col items-center justify-center rounded-xl border border-dashed border-brand/20 bg-[#f0f4ff] text-center dark:border-white/10 dark:bg-white/5">
            <Briefcase className="mb-2 h-6 w-6 text-brand" />
            <p className="text-sm text-muted">
              {t.dashboard.profileNoDocument}
            </p>
          </div>
        )}
      </ProfileSection>

      {documentUrl ? (
        <ProfileImagePreview
          open={previewOpen}
          src={documentUrl}
          alt={t.dashboard.profileIdDocument}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </>
  );
}
