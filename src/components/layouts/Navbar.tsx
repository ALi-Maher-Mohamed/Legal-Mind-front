'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useScroll } from '@/hooks/useScroll';
import { useLanguage } from '@/hooks/useLanguage';
import { useThemeContext } from '@/lib/providers/ThemeProvider';
import { ROUTES } from '@/config/routes';
import { Button } from '@/components/ui';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const scrolled = useScroll(20);
  const { locale, toggleLanguage, t, isRtl } = useLanguage();
  const { theme, toggleTheme } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: t.nav.services, href: ROUTES.services },
    { name: t.nav.pricing, href: ROUTES.pricing },
    { name: t.nav.faq, href: ROUTES.faq },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-outline/40 bg-background/90 py-3 shadow-sm backdrop-blur-md'
            : 'border-b border-transparent bg-transparent py-4'
        }`}
      >
        <div className="lm-container flex items-center justify-between gap-4">
          <Logo />

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 transition hover:text-brand"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitch locale={locale} onToggle={toggleLanguage} />
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-outline/50 text-muted hover:bg-surface-raised hover:text-foreground transition"
              aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link href={ROUTES.login}>
              <Button variant="primary" size="sm">
                {t.common.getStarted}
              </Button>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitch locale={locale} onToggle={toggleLanguage} compact />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground focus:outline-none"
              aria-label="Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className={`fixed top-0 bottom-0 ${isRtl ? 'right-0' : 'left-0'} w-72 bg-card border-outline/40 border p-6 flex flex-col justify-between z-50`}
            >
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <Logo />
                  <button type="button" onClick={() => setIsOpen(false)} className="text-muted hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-semibold text-foreground border-b border-outline/30 pb-2"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="secondary" fullWidth onClick={toggleTheme}>
                  {theme === 'dark' ? (isRtl ? 'الوضع الفاتح' : 'Light') : isRtl ? 'الوضع الداكن' : 'Dark'}
                </Button>
                <Link href={ROUTES.login} onClick={() => setIsOpen(false)}>
                  <Button variant="primary" fullWidth>
                    {t.common.getStarted}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LanguageSwitch({
  locale,
  onToggle,
  compact = false,
}: {
  locale: 'en' | 'ar';
  onToggle: () => void;
  compact?: boolean;
}) {
  const isAr = locale === 'ar';

  return (
    <button
      type="button"
      role="switch"
      dir="ltr"
      aria-checked={isAr}
      aria-label={isAr ? 'Switch to English' : 'التبديل للعربية'}
      onClick={onToggle}
      className={`relative inline-flex items-center rounded-full border border-outline/50 bg-surface-raised p-0.5 cursor-pointer select-none ${
        compact ? 'h-8 w-[4.25rem]' : 'h-8 w-[4.75rem]'
      }`}
    >
      <span
        className={`absolute top-0.5 bottom-0.5 start-0.5 w-[calc(50%-2px)] rounded-full bg-brand shadow-sm transition-transform duration-200 ${
          isAr ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
        }`}
      />
      <span className={`relative z-10 flex-1 text-center text-[10px] font-semibold ${!isAr ? 'text-on-brand' : 'text-muted'}`}>
        EN
      </span>
      <span className={`relative z-10 flex-1 text-center text-[10px] font-semibold ${isAr ? 'text-on-brand' : 'text-muted'}`}>
        عر
      </span>
    </button>
  );
}

function Logo() {
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') return;
    const isHome = window.location.pathname === '/' || window.location.pathname === '';
    if (!isHome) return;
    e.preventDefault();
    if (window.location.hash) window.history.replaceState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link href={ROUTES.home} onClick={scrollToTop} className="flex items-center gap-2 group select-none">
      <svg className="h-8 w-8" viewBox="0 0 100 100" fill="none" aria-hidden>
        <path
          d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z"
          stroke="url(#logo-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="35" r="5" fill="var(--lm-accent)" className="animate-pulse" />
        <path d="M35 52 L65 52" stroke="var(--lm-brand)" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 35 L50 65" stroke="url(#logo-grad)" strokeWidth="4" />
        <path d="M42 65 L58 65" stroke="var(--lm-accent)" strokeWidth="5" strokeLinecap="round" />
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="var(--lm-brand)" />
            <stop offset="100%" stopColor="var(--lm-brand-soft)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg font-bold tracking-tight text-foreground">
        LegalMind<span className="text-brand ms-0.5">AI</span>
      </span>
    </Link>
  );
}
