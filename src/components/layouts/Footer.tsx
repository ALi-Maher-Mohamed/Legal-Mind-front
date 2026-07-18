// src/components/layouts/Footer.tsx
'use client';

import React, { useState } from 'react';
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
    { name: isRtl ? "شروط الخدمة" : "Terms of Service", href: "#" },
    { name: isRtl ? "سياسة الخصوصية" : "Privacy Policy", href: "#" },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <a href={ROUTES.home} className="flex items-center gap-2">
              <svg className="h-7 w-7 text-accent-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="50" cy="35" r="5" className="fill-current" />
                <path d="M35 52 L65 52" stroke="#60A5FA" strokeWidth="4" />
                <path d="M50 35 L50 65" stroke="#60A5FA" strokeWidth="4" />
              </svg>
              <span className="font-sans text-base font-bold text-slate-100">
                LegalMind<span className="text-accent-gold ml-0.5">AI</span>
              </span>
            </a>
            <p className="text-xs sm:text-sm leading-relaxed max-w-md">
              {t.footer.desc}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-2">
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-4">{t.footer.product}</h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-300">
              {productLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-white transition">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-4">{t.footer.legal}</h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-300">
              {legalLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-white transition">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-4">{t.footer.legal}</h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-300">
              {legalLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-white transition">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-slate-800 py-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 max-w-lg text-center lg:text-start">
            <h4 className="text-sm font-semibold text-slate-100">{t.footer.newsletterTitle}</h4>

          <form onSubmit={handleSubscribe} className="flex w-full max-w-sm gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.common.emailPlaceholder}
              required
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Button type="submit" variant="primary" size="sm" isLoading={loading}>
              {success ? (isRtl ? "تم الاشتراك!" : "Subscribed!") : t.footer.newsletterBtn}
            </Button>
          </form>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>{t.footer.copyright}</span>
          <span className="text-[10px] text-slate-500">Powered by Advanced Agentic Neural Architectures</span>
        </div>
      </div>
      </div>
    </footer>
  );
  
}