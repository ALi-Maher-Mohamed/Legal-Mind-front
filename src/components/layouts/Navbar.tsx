"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useScroll } from "@/hooks/useScroll";
import { useLanguage } from "@/hooks/useLanguage";
import { useThemeContext } from "@/lib/providers/ThemeProvider";
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../common/logo";

export default function Navbar() {
  const scrolled = useScroll(20);
  const { t } = useLanguage();
  const { theme, toggleTheme } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: t.nav.services, href: ROUTES.services },
    { name: t.nav.pricing, href: ROUTES.pricing },
    { name: t.nav.faq, href: ROUTES.faq },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isOpen ? "pointer-events-none opacity-0" : "opacity-100"
        } ${
          scrolled
            ? "border-b border-outline/40 bg-background/90 py-3 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-transparent py-4"
        }`}
      >
        <div className="lm-container flex items-center justify-between gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-8">
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

          <div className="hidden lg:flex items-center gap-3">
            <ThemeSwitch theme={theme} onToggle={toggleTheme} />
            <Link href={ROUTES.login}>
              <Button variant="primary" size="sm">
                {t.common.getStarted}
              </Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-surface-raised transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label="القائمة"
            aria-expanded={isOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="القائمة"
          >
            <button
              type="button"
              aria-label="إغلاق القائمة"
              className="absolute inset-0 bg-[#0b1326]/45 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.08, duration: 0.35 }}
              className="absolute top-0 bottom-0 end-0 flex w-[min(100%,20rem)] flex-col bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between gap-3 border-b border-outline/30 px-5 py-4">
                <Logo compact onNavigate={() => setIsOpen(false)} />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-raised hover:text-foreground transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  aria-label="إغلاق"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-surface-raised hover:text-brand transition"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="space-y-4 border-t border-outline/30 px-5 py-5">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    المظهر
                  </p>
                  <ThemeSwitch theme={theme} onToggle={toggleTheme} fullWidth />
                </div>

                <Link
                  href={ROUTES.login}
                  onClick={() => setIsOpen(false)}
                  className="block pt-1"
                >
                  <Button variant="primary" fullWidth>
                    {t.common.getStarted}
                  </Button>
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ThemeSwitch({
  theme,
  onToggle,
  fullWidth = false,
}: {
  theme: "light" | "dark";
  onToggle: () => void;
  fullWidth?: boolean;
}) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      dir="ltr"
      aria-checked={isDark}
      aria-label={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
      onClick={onToggle}
      className={`relative inline-flex items-center rounded-full border border-outline/50 bg-surface-raised p-1 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
        fullWidth ? "h-11 w-full" : "h-9 w-[5.75rem]"
      }`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute top-1 bottom-1 start-1 w-[calc(50%-4px)] rounded-full bg-brand shadow-[0_1px_4px_rgba(0,62,199,0.35)] transition-transform duration-200 ease-out ${
          isDark ? "translate-x-full" : "translate-x-0"
        }`}
      />
      <span
        className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 font-semibold transition-colors ${
          fullWidth ? "text-sm" : "text-[11px]"
        } ${!isDark ? "text-on-brand" : "text-muted"}`}
      >
        <Sun className="h-3.5 w-3.5 shrink-0" />
        {fullWidth ? "فاتح" : null}
      </span>
      <span
        className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 font-semibold transition-colors ${
          fullWidth ? "text-sm" : "text-[11px]"
        } ${isDark ? "text-on-brand" : "text-muted"}`}
      >
        <Moon className="h-3.5 w-3.5 shrink-0" />
        {fullWidth ? "داكن" : null}
      </span>
    </button>
  );
}
