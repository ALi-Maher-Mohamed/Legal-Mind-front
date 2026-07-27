'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      gutter={10}
      toastOptions={{
        duration: 4200,
        className:
          '!bg-card !text-foreground !border !border-brand/15 !shadow-lg !rounded-xl !text-sm !font-medium dark:!border-white/10',
        success: {
          iconTheme: {
            primary: 'var(--lm-brand)',
            secondary: 'var(--lm-on-brand, #fff)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--lm-danger, #ba1a1a)',
            secondary: '#fff',
          },
        },
        style: {
          direction: 'rtl',
          maxWidth: '420px',
        },
      }}
    />
  );
}
