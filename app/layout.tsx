import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { LanguageProvider } from '@/lib/providers/LanguageProvider';
import { ThemeProvider } from '@/lib/providers/ThemeProvider';
import { buildThemeStyleTag } from '@/config/theme';

const ibmPlexArabic = localFont({
  src: [
    {
      path: './fonts/IBMPlexSansArabic-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/IBMPlexSansArabic-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/IBMPlexSansArabic-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/IBMPlexSansArabic-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LegalMind AI — المساعد القانوني بالذكاء الاصطناعي',
  description:
    'صياغة العقود الذكية، مراجعة الاتفاقيات، متابعة القضايا، واستشارات قانونية فورية مدعومة بالذكاء الاصطناعي.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-icon.svg', type: 'image/svg+xml' }],
  },
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
      data-locale="ar"
      className={`${ibmPlexArabic.variable} h-full antialiased scroll-smooth`}
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
                  root.lang = 'ar';
                  root.setAttribute('dir', 'rtl');
                  root.style.setProperty('direction', 'rtl');
                  root.setAttribute('data-locale', 'ar');
                  try { localStorage.removeItem('locale'); } catch (e) {}
                  function applyBodyDir() {
                    if (!document.body) return;
                    document.body.setAttribute('dir', 'rtl');
                    document.body.style.setProperty('direction', 'rtl');
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
        dir="rtl"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
