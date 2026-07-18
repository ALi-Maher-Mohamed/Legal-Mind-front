import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/providers/LanguageProvider';
import { ThemeProvider } from '@/lib/providers/ThemeProvider';
import { buildThemeStyleTag } from '@/config/theme';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-ibm-plex-arabic',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LegalMind AI - Premium AI Legal Assistant',
  description:
    'Draft smart contracts, review agreements, track court cases, and receive instant legal counsel powered by neural legal intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="ar"
      dir="rtl"
      className={`${ibmPlexArabic.variable} ${inter.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <style
          id="legalmind-theme-tokens"
          dangerouslySetInnerHTML={{ __html: buildThemeStyleTag() }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var root = document.documentElement;
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    root.classList.remove('dark');
                    root.classList.add('light');
                    root.style.colorScheme = 'light';
                  } else {
                    root.classList.add('dark');
                    root.classList.remove('light');
                    root.style.colorScheme = 'dark';
                  }

                  var locale = localStorage.getItem('locale');
                  if (locale !== 'en' && locale !== 'ar') locale = 'ar';
                  var dir = locale === 'ar' ? 'rtl' : 'ltr';
                  root.lang = locale;
                  root.setAttribute('dir', dir);
                  root.style.setProperty('direction', dir);
                  root.setAttribute('data-locale', locale);
                  function applyBodyDir() {
                    if (!document.body) return;
                    document.body.setAttribute('dir', dir);
                    document.body.style.setProperty('direction', dir);
                  }
                  applyBodyDir();
                  document.addEventListener('DOMContentLoaded', applyBodyDir);
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body
        className="min-h-full bg-background text-foreground flex flex-col font-sans antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
