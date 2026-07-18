import { ROUTES } from "@/config/routes";
import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";
import { useId } from "react";

export function Logo({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { t } = useLanguage();
  const gradId = useId().replace(/:/g, "");

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (typeof window === "undefined") return;
    const isHome =
      window.location.pathname === "/" || window.location.pathname === "";
    if (!isHome) return;
    e.preventDefault();
    if (window.location.hash) window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link
      href={ROUTES.dashboard}
      onClick={scrollToTop}
      className="flex items-center gap-2 group select-none shrink-0 min-w-0"
      aria-label={`${t.common.brandName} ${t.common.brandSuffix}`}
    >
      <svg
        className={`${compact ? "h-8 w-8" : "h-9 w-9"} shrink-0`}
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <path
          d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z"
          stroke={`url(#${gradId})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="35" r="5.5" fill="var(--lm-accent)" />
        <path
          d="M35 52 L65 52"
          stroke="var(--lm-brand)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M50 35 L50 65" stroke={`url(#${gradId})`} strokeWidth="5" />
        <path
          d="M42 65 L58 65"
          stroke="var(--lm-accent)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="var(--lm-brand)" />
            <stop offset="100%" stopColor="var(--lm-brand-deep)" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={`${
          compact ? "text-sm" : "text-base sm:text-lg"
        } font-bold tracking-tight text-foreground leading-none truncate`}
      >
        {t.common.brandName}
        <span className="text-brand ms-1">{t.common.brandSuffix}</span>
      </span>
    </Link>
  );
}
