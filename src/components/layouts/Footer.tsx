"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { ROUTES, SOCIAL_LINKS } from "@/config/routes";
import { Twitter, Linkedin, Github } from "lucide-react";
import { Logo } from "../common/logo";

export default function Footer() {
  const { t, isRtl } = useLanguage();
  const productLinks = [
    { name: t.nav.services, href: ROUTES.services },
    { name: t.nav.pricing, href: ROUTES.pricing },
  ];

  const companyLinks = [
    { name: t.nav.about, href: ROUTES.about },
    { name: t.nav.faq, href: ROUTES.faq },
  ];

  const legalLinks = [
    { name: isRtl ? "شروط الخدمة" : "Terms of Service", href: "#" },
    { name: isRtl ? "سياسة الخصوصية" : "Privacy Policy", href: "#" },
  ];

  return (
    <footer className="border-t border-outline/40 bg-surface-muted pt-14 pb-8 text-muted">
      <div className="lm-container">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Logo />
            <div className="mt-1 flex items-center gap-4">
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand transition"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
              {t.footer.product}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-brand transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
              {t.footer.company}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-brand transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
              {t.footer.legal}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-brand transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-outline/40 pt-6 text-center text-xs text-muted sm:flex-row">
          <span>{t.footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
