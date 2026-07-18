import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/providers/LanguageProvider';
import { ThemeProvider } from '@/lib/providers/ThemeProvider';
import { buildThemeStyleTag } from '@/config/theme';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
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
                  root.lang = locale;
                  root.dir = locale === 'ar' ? 'rtl' : 'ltr';
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground flex flex-col font-sans antialiased overflow-x-hidden">
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
