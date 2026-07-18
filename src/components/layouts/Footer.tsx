'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES, SOCIAL_LINKS } from '@/config/routes';
import { Twitter, Linkedin, Github } from 'lucide-react';

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
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-16 pb-8 text-slate-600 dark:text-slate-300 transition-colors duration-300 text-start">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* شبكة اللينكات الرئيسية: متجاوبة 100% تبدأ عمود واحد في الموبايل وتنتهي 5 أعمدة في الشاشات الكبيرة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Info */}
          <div className="sm:col-span-2 flex flex-col gap-4">
            <a href={ROUTES.home} className="flex items-center gap-2 w-fit">
              <svg className="h-7 w-7 text-accent-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="50" cy="35" r="5" className="fill-current" />
                <path d="M35 52 L65 52" stroke="#60A5FA" strokeWidth="4" />
                <path d="M50 35 L50 65" stroke="#60A5FA" strokeWidth="4" />
              </svg>
              <span className="font-sans text-base font-bold text-slate-900 dark:text-slate-100">
                LegalMind<span className="text-accent-gold ml-0.5 rtl:ml-0 rtl:mr-0.5">AI</span>
              </span>
            </a>
            <p className="text-xs sm:text-sm leading-relaxed max-w-md text-slate-500 dark:text-slate-400">
              {t.footer.desc}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-2">
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 dark:hover:text-blue-400 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-500 transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 1 - Services */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              {t.footer.product}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {productLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Company */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              {isRtl ? "الشركة" : "Company"}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              {t.footer.legal}
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {legalLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Block - متجاوب بشكل كامل يتحول لعمودي في الموبايل وأفقي في الشاشات الواسعة */}
        <div className="border-t border-slate-200 dark:border-slate-900 pt-8 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-slate-500 dark:text-slate-400">{t.footer.copyright}</span>
          <span className="text-[10px] text-slate-400/60 dark:text-slate-500/60 tracking-wide">
            
          </span>
        </div>

      </div>
    </footer>
  );
}