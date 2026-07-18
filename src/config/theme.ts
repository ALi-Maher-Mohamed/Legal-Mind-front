/**
 * LegalMind design tokens — single source of truth for colors & theme.
 *
 * Usage in new features:
 *   import { colors, palette, withAlpha } from '@/config/theme';
 *
 * Tailwind (after ThemeProvider mounts CSS vars):
 *   bg-surface  text-brand  text-accent  border-border  bg-surface-raised
 */

export type ThemeMode = 'light' | 'dark';

/** Raw brand & UI palette — edit hex values here */
export const palette = {
  brand: {
    blue: '#3B82F6',
    blueSoft: '#60A5FA',
    blueDeep: '#2563EB',
    purple: '#8B5CF6',
    gold: '#F6C453',
  },
  surface: {
    void: '#090909',
    ink: '#0F172A',
    raised: '#181818',
    panel: '#131313',
    card: '#111827',
    muted: '#1F2937',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

/** Semantic tokens per mode — what components should prefer */
export const themes = {
  light: {
    background: palette.slate[50],
    foreground: palette.slate[900],
    card: palette.white,
    surface: palette.white,
    surfaceRaised: palette.slate[50],
    surfaceMuted: palette.slate[100],
    border: palette.slate[200],
    borderStrong: palette.slate[300],
    muted: palette.slate[500],
    mutedForeground: palette.slate[600],
    brand: palette.brand.blue,
    brandSoft: palette.brand.blueSoft,
    brandDeep: palette.brand.blueDeep,
    accent: palette.brand.gold,
    accentPurple: palette.brand.purple,
    success: palette.status.success,
    warning: palette.status.warning,
    danger: palette.status.danger,
    ring: palette.brand.blue,
    selection: 'rgba(59, 130, 246, 0.2)',
    scrollbarTrack: palette.slate[100],
    scrollbarThumb: palette.slate[300],
  },
  dark: {
    background: palette.surface.ink,
    foreground: palette.slate[50],
    card: palette.surface.card,
    surface: palette.surface.void,
    surfaceRaised: palette.surface.raised,
    surfaceMuted: palette.surface.muted,
    border: palette.slate[700],
    borderStrong: palette.slate[600],
    muted: palette.slate[400],
    mutedForeground: palette.slate[300],
    brand: palette.brand.blueSoft,
    brandSoft: palette.brand.blue,
    brandDeep: palette.brand.blueDeep,
    accent: palette.brand.gold,
    accentPurple: palette.brand.purple,
    success: palette.status.success,
    warning: palette.status.warning,
    danger: palette.status.danger,
    ring: palette.brand.blueSoft,
    selection: 'rgba(96, 165, 250, 0.2)',
    scrollbarTrack: palette.surface.ink,
    scrollbarThumb: palette.slate[600],
  },
} as const;

export type ThemeTokens = (typeof themes)[ThemeMode];

/** Flat aliases for quick imports (defaults to brand / dark landing look) */
export const colors = {
  brand: palette.brand.blue,
  brandSoft: palette.brand.blueSoft,
  brandDeep: palette.brand.blueDeep,
  accent: palette.brand.gold,
  purple: palette.brand.purple,
  surface: palette.surface.void,
  surfaceRaised: palette.surface.raised,
  surfacePanel: palette.surface.panel,
  surfaceCard: palette.surface.card,
  success: palette.status.success,
  warning: palette.status.warning,
  danger: palette.status.danger,
  white: palette.white,
  black: palette.black,
} as const;

/** Logo / gradient stops used in SVG */
export const gradients = {
  logo: {
    from: palette.brand.blue,
    to: palette.brand.purple,
  },
  brandAccent: {
    from: palette.brand.blueSoft,
    to: palette.brand.gold,
  },
} as const;

/** Common glow / overlay alphas for cards & hero effects */
export const glows = {
  brand: withAlpha(palette.brand.blue, 0.2),
  brandSoft: withAlpha(palette.brand.blue, 0.18),
  accent: withAlpha(palette.brand.gold, 0.2),
  accentSoft: withAlpha(palette.brand.gold, 0.18),
  purple: withAlpha(palette.brand.purple, 0.2),
} as const;

const CSS_VAR_MAP: Record<keyof ThemeTokens, string> = {
  background: '--lm-background',
  foreground: '--lm-foreground',
  card: '--lm-card',
  surface: '--lm-surface',
  surfaceRaised: '--lm-surface-raised',
  surfaceMuted: '--lm-surface-muted',
  border: '--lm-border',
  borderStrong: '--lm-border-strong',
  muted: '--lm-muted',
  mutedForeground: '--lm-muted-foreground',
  brand: '--lm-brand',
  brandSoft: '--lm-brand-soft',
  brandDeep: '--lm-brand-deep',
  accent: '--lm-accent',
  accentPurple: '--lm-accent-purple',
  success: '--lm-success',
  warning: '--lm-warning',
  danger: '--lm-danger',
  ring: '--lm-ring',
  selection: '--lm-selection',
  scrollbarTrack: '--lm-scrollbar-track',
  scrollbarThumb: '--lm-scrollbar-thumb',
};

/** CSS custom properties for a given mode */
export function getThemeCssVars(mode: ThemeMode): Record<string, string> {
  const tokens = themes[mode];
  const vars: Record<string, string> = {};

  (Object.keys(CSS_VAR_MAP) as Array<keyof ThemeTokens>).forEach((key) => {
    vars[CSS_VAR_MAP[key]] = tokens[key];
  });

  // Backward-compatible aliases used in older CSS / classes
  vars['--color-background'] = tokens.background;
  vars['--color-foreground'] = tokens.foreground;
  vars['--color-card-dark'] = tokens.card;
  vars['--color-primary-blue'] = tokens.brand;
  vars['--color-accent-gold'] = tokens.accent;

  return vars;
}

/** Inline <style> for SSR / first paint — keeps CSS in sync with this file */
export function buildThemeStyleTag(): string {
  const light = getThemeCssVars('light');
  const dark = getThemeCssVars('dark');

  const toBlock = (vars: Record<string, string>) =>
    Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');

  return `:root {\n${toBlock(light)}\n}\n\n.dark {\n${toBlock(dark)}\n}\n`;
}

/** Apply tokens to an element (usually document.documentElement) */
export function applyThemeVars(el: HTMLElement, mode: ThemeMode) {
  const vars = getThemeCssVars(mode);
  Object.entries(vars).forEach(([key, value]) => {
    el.style.setProperty(key, value);
  });
}

/** Hex → rgba string helper for glows / overlays */
export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;

  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
