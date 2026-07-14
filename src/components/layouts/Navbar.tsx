// src/components/layouts/Navbar.tsx
'use client';

import React, { useState } from 'react';
import { useScroll } from '@/hooks/useScroll';
import { useLanguage } from '@/hooks/useLanguage';
import { ROUTES } from '@/config/routes';
import { Button } from '@/components/ui';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const scrolled = useScroll(20);
  const { locale, setLocale, t, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const toggleLangMenu = () => setShowLangMenu(!showLangMenu);

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setLocale(lang);
    setShowLangMenu(false);
  };

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
            ? 'bg-[#090909]/80 border-b border-white/10 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-400 hover:text-white transition duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Language switch & Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Picker Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleLangMenu}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white text-xs cursor-pointer transition select-none"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{locale === 'en' ? 'English' : 'العربية'}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className={`absolute ${
                        isRtl ? 'left-0' : 'right-0'
                      } mt-2 w-32 rounded-xl bg-[#181818] border border-white/10 p-1.5 shadow-xl`}
                    >
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 hover:text-white transition cursor-pointer"
                      >
                        English
                      </button>
                      <button
                        onClick={() => handleLanguageChange('ar')}
                        className="w-full text-right px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/5 hover:text-white transition cursor-pointer"
                      >
                        العربية
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button variant="ghost" size="sm">
                {t.common.login}
              </Button>
              <Button variant="primary" size="sm">
                {t.common.getStarted}
              </Button>
            </div>

            {/* Mobile Hamburger menu icon */}
            <div className="flex md:hidden items-center gap-3">
              {/* Mobile Language Switch Toggle */}
              <button
                onClick={() => handleLanguageChange(locale === 'en' ? 'ar' : 'en')}
                className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white"
              >
                <Globe className="h-4 w-4" />
              </button>

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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
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
                <Button variant="secondary" fullWidth onClick={() => setIsOpen(false)}>
                  {t.common.login}
                </Button>
                <Button variant="primary" fullWidth onClick={() => setIsOpen(false)}>
                  {t.common.getStarted}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Logo() {
  return (
    <a href={ROUTES.home} className="flex items-center gap-2 group cursor-pointer select-none">
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
      <span className="font-sans text-lg font-bold tracking-tight text-white transition-all group-hover:text-blue-400">
        LegalMind<span className="text-[#F6C453] ml-0.5">AI</span>
      </span>
    </a>
  );
}

