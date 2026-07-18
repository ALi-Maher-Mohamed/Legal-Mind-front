
// src/components/layouts/Navbar.tsx
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3 shadow-sm'
            : 'bg-transparent border-b border-transparent py-5 dark:bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo scrolled={scrolled} />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition duration-200 ${
                    scrolled
                      ? 'text-slate-900 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white'
                      : 'text-slate-100 hover:text-white dark:text-slate-100 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Language switch & Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitch
                locale={locale}
                onToggle={toggleLanguage}
                scrolled={scrolled}
              />

              <Link href={ROUTES.login}>
                <Button
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 border-none transition-colors"
                >
                  {t.common.login}
                </Button>
              </Link>

              <Button variant="secondary" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? (
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-400" />
                    {isRtl ? 'الوضع الفاتح' : 'Light'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" style={{ color: 'white' }} />
                    {isRtl ? 'الوضع الداكن' : 'Dark'}
                  </div>
                )}
              </Button>
              <Link href={ROUTES.login}>
                <Button variant="primary" size="sm">
                  {t.common.getStarted}
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger menu icon */}
            <div className="flex md:hidden items-center gap-3">
              <LanguageSwitch
                locale={locale}
                onToggle={toggleLanguage}
                scrolled={scrolled}
                compact
              />

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-white focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          >
            {/* Drawer menu content */}
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className={`fixed top-0 bottom-0 ${
                isRtl ? 'right-0' : 'left-0'
              } w-72 bg-[#090909] border-l border-white/10 p-6 flex flex-col justify-between z-50`}
            >
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <Logo />
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-5">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-semibold text-gray-300 hover:text-white border-b border-white/5 pb-2 block"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="flex flex-col gap-3">
                <Link href={ROUTES.login} onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" fullWidth>
                    {t.common.login}
                  </Button>
                </Link>
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
  scrolled = false,
  compact = false,
}: {
  locale: 'en' | 'ar';
  onToggle: () => void;
  scrolled?: boolean;
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
      className={`relative inline-flex items-center rounded-full border p-0.5 cursor-pointer select-none transition ${
        compact ? 'h-8 w-[4.25rem]' : 'h-8 w-[4.75rem]'
      } ${
        scrolled
          ? 'border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900'
          : 'border-white/15 bg-white/10'
      }`}
    >
      <span
        className={`absolute top-0.5 bottom-0.5 start-0.5 w-[calc(50%-2px)] rounded-full bg-blue-600 shadow-sm transition-transform duration-200 ${
          isAr ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
        }`}
      />
      <span
        className={`relative z-10 flex-1 text-center text-[10px] font-semibold transition-colors ${
          !isAr ? 'text-white' : scrolled ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300'
        }`}
      >
        EN
      </span>
      <span
        className={`relative z-10 flex-1 text-center text-[10px] font-semibold transition-colors ${
          isAr ? 'text-white' : scrolled ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300'
        }`}
      >
        عر
      </span>
    </button>
  );
}

function Logo({ scrolled = false }: { scrolled?: boolean }) {
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') return;
    const isHome = window.location.pathname === '/' || window.location.pathname === '';
    if (!isHome) return;

    e.preventDefault();
    if (window.location.hash) {
      window.history.replaceState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Link href={ROUTES.home} onClick={scrollToTop} className="flex items-center gap-2 group cursor-pointer select-none">
      <svg className="h-8 w-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield outline */}
        <path d="M50 12 L85 24 C85 55 70 78 50 88 C30 78 15 55 15 24 Z" stroke="url(#logo-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Inner neural connection / scale bars */}
        <circle cx="50" cy="35" r="5" fill="#F6C453" className="animate-pulse" />
        <path d="M35 52 L65 52" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 35 L50 65" stroke="url(#logo-grad)" strokeWidth="4" />
        <path d="M42 65 L58 65" stroke="#F6C453" strokeWidth="5" strokeLinecap="round" />
        {/* Gradients */}
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <span className={`font-sans text-lg font-bold tracking-tight transition-all ${
        scrolled 
          ? 'text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-300' 
          : 'text-slate-100 group-hover:text-blue-300 dark:text-slate-100'
      }`}>
        LegalMind<span className="text-accent-gold ml-0.5">AI</span>
      </span>
    </Link>
  );
}