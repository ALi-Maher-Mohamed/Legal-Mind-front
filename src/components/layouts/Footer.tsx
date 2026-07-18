'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES, SOCIAL_LINKS } from '@/config/routes';
import { Button } from '@/components/ui';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const { t, isRtl } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  const productLinks = [
    { name: t.nav.services, href: ROUTES.services },
    { name: t.nav.pricing, href: ROUTES.pricing },
  ];

  const companyLinks = [
    { name: t.nav.about, href: ROUTES.about },
    { name: t.nav.faq, href: ROUTES.faq },
  ];

  const legalLinks = [
    { name: isRtl ? 'شروط الخدمة' : 'Terms of Service', href: '#' },
    { name: isRtl ? 'سياسة الخصوصية' : 'Privacy Policy', href: '#' },
  ];

  return (
    <footer className="border-t border-outline/40 bg-surface-muted pt-14 pb-8 text-muted">
      <div className="lm-container">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link href={ROUTES.home} className="flex items-center gap-2.5 shrink-0" aria-label={`${t.common.brandName} ${t.common.brandSuffix}`}>
              <svg className="h-8 w-8 shrink-0 text-brand" viewBox="0 0 100 100" fill="none" aria-hidden>
                <path
                  d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="50" cy="35" r="5.5" fill="var(--lm-accent)" />
                <path d="M35 52 L65 52" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M50 35 L50 65" stroke="currentColor" strokeWidth="5" />
                <path d="M42 65 L58 65" stroke="var(--lm-accent)" strokeWidth="5.5" strokeLinecap="round" />
              </svg>
              <span className="text-base font-bold text-foreground leading-none whitespace-nowrap">
                {t.common.brandName}
                <span className="text-brand ms-1">{t.common.brandSuffix}</span>
              </span>
            </Link>
            <p className="max-w-md text-xs sm:text-sm leading-relaxed">{t.footer.desc}</p>
            <div className="mt-1 flex items-center gap-4">
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">{t.footer.product}</h3>
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
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">{t.footer.company}</h3>
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
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">{t.footer.legal}</h3>
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

        <div className="flex flex-col items-center justify-between gap-6 border-t border-outline/40 py-8 lg:flex-row">
          <div className="max-w-lg text-center lg:text-start">
            <h4 className="text-sm font-semibold text-foreground">{t.footer.newsletterTitle}</h4>
            <p className="mt-1 text-xs text-muted">{t.footer.newsletterDesc}</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-sm gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.common.emailPlaceholder}
              required
              className="w-full rounded-lg border border-outline bg-card px-4 py-2 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <Button type="submit" variant="primary" size="sm" isLoading={loading}>
              {success ? (isRtl ? 'تم!' : 'Done!') : t.footer.newsletterBtn}
            </Button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-outline/40 pt-6 text-center text-xs text-muted sm:flex-row">
          <span>{t.footer.copyright}</span>
          <span className="text-[10px]">JurisTech Precision</span>
        </div>
      </div>
    </footer>
  );
}
