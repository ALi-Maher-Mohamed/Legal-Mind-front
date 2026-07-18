/**
 * JurisTech Precision tokens — single source from DESIGN.md (dark) + DESIGN light.
 *
 * Tailwind: bg-background text-foreground bg-card text-brand border-outline
 */

export type ThemeMode = 'light' | 'dark';

/** Raw Material-style palette from design system docs */
export const palette = {
  light: {
    background: '#f7f9fb',
    surface: '#f7f9fb',
    surfaceDim: '#d8dadc',
    surfaceBright: '#f7f9fb',
    surfaceLowest: '#ffffff',
    surfaceLow: '#f2f4f6',
    surfaceContainer: '#eceef0',
    surfaceHigh: '#e6e8ea',
    surfaceHighest: '#e0e3e5',
    onSurface: '#191c1e',
    onSurfaceVariant: '#434656',
    outline: '#c3c5d9',
    outlineStrong: '#737688',
    primary: '#003ec7',
    onPrimary: '#ffffff',
    primaryContainer: '#0052ff',
    secondary: '#565e74',
    tertiary: '#3f4f65',
    error: '#ba1a1a',
    inverseSurface: '#2d3133',
  },
  dark: {
    background: '#0b1326',
    surface: '#0b1326',
    surfaceDim: '#0b1326',
    surfaceBright: '#31394d',
    surfaceLowest: '#060e20',
    surfaceLow: '#131b2e',
    surfaceContainer: '#171f33',
    surfaceHigh: '#222a3d',
    surfaceHighest: '#2d3449',
    onSurface: '#dae2fd',
    onSurfaceVariant: '#c4c6cf',
    outline: '#43474e',
    outlineStrong: '#8e9099',
    primary: '#adc7f7',
    onPrimary: '#133057',
    primaryContainer: '#1a365d',
    secondary: '#a2c9ff',
    tertiary: '#f8bc4b',
    error: '#ffb4ab',
    inverseSurface: '#dae2fd',
  },
} as const;

/** Semantic tokens used by CSS vars + components */
export const themes = {
  light: {
    background: palette.light.background,
    foreground: palette.light.onSurface,
    card: palette.light.surfaceLowest,
    surface: palette.light.surfaceLowest,
    surfaceRaised: palette.light.surfaceLow,
    surfaceMuted: palette.light.surfaceHigh,
    border: palette.light.outline,
    borderStrong: palette.light.outlineStrong,
    muted: palette.light.onSurfaceVariant,
    mutedForeground: palette.light.onSurfaceVariant,
    brand: palette.light.primary,
    brandSoft: palette.light.primaryContainer,
    brandDeep: '#0038b6',
    onBrand: palette.light.onPrimary,
    accent: '#d69e2e',
    accentPurple: '#57677e',
    success: '#0f7b4a',
    warning: '#d69e2e',
    danger: palette.light.error,
    ring: palette.light.primary,
    selection: 'rgba(0, 62, 199, 0.18)',
    scrollbarTrack: palette.light.surfaceLow,
    scrollbarThumb: palette.light.outline,
  },
  dark: {
    background: palette.dark.background,
    foreground: palette.dark.onSurface,
    card: palette.dark.surfaceContainer,
    surface: palette.dark.surfaceContainer,
    surfaceRaised: palette.dark.surfaceHigh,
    surfaceMuted: palette.dark.surfaceLowest,
    border: palette.dark.outline,
    borderStrong: palette.dark.outlineStrong,
    muted: palette.dark.onSurfaceVariant,
    mutedForeground: palette.dark.onSurfaceVariant,
    brand: palette.dark.primary,
    brandSoft: palette.dark.primaryContainer,
    brandDeep: '#86a0cd',
    onBrand: palette.dark.onPrimary,
    accent: palette.dark.tertiary,
    accentPurple: '#a2c9ff',
    success: '#10b981',
    warning: palette.dark.tertiary,
    danger: palette.dark.error,
    ring: palette.dark.primary,
    selection: 'rgba(173, 199, 247, 0.2)',
    scrollbarTrack: palette.dark.surfaceLowest,
    scrollbarThumb: palette.dark.outlineStrong,
  },
} as const;

export type ThemeTokens = (typeof themes)[ThemeMode];

export const colors = {
  brand: themes.light.brand,
  brandSoft: themes.light.brandSoft,
  onBrand: themes.light.onBrand,
  accent: themes.dark.accent,
  surface: themes.dark.background,
  surfaceRaised: themes.dark.surface,
  surfaceCard: themes.dark.card,
  success: themes.light.success,
  warning: themes.light.warning,
  danger: themes.light.danger,
  white: '#ffffff',
  black: '#000000',
} as const;

export const gradients = {
  logo: { from: '#003ec7', to: '#adc7f7' },
  brandAccent: { from: '#003ec7', to: '#d69e2e' },
} as const;

export const glows = {
  brand: withAlpha('#003ec7', 0.15),
  brandSoft: withAlpha('#003ec7', 0.1),
  accent: withAlpha('#f8bc4b', 0.2),
  accentSoft: withAlpha('#f8bc4b', 0.12),
  purple: withAlpha('#adc7f7', 0.15),
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
  onBrand: '--lm-on-brand',
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

export function getThemeCssVars(mode: ThemeMode): Record<string, string> {
  const tokens = themes[mode];
  const vars: Record<string, string> = {};

  (Object.keys(CSS_VAR_MAP) as Array<keyof ThemeTokens>).forEach((key) => {
    vars[CSS_VAR_MAP[key]] = tokens[key];
  });

  vars['--color-background'] = tokens.background;
  vars['--color-foreground'] = tokens.foreground;
  vars['--color-card-dark'] = tokens.card;
  vars['--color-primary-blue'] = tokens.brand;
  vars['--color-accent-gold'] = tokens.accent;

  return vars;
}

export function buildThemeStyleTag(): string {
  const light = getThemeCssVars('light');
  const dark = getThemeCssVars('dark');

  const toBlock = (vars: Record<string, string>) =>
    Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');

  return `:root {\n${toBlock(light)}\n}\n\n.dark {\n${toBlock(dark)}\n}\n`;
}

export function applyThemeVars(el: HTMLElement, mode: ThemeMode) {
  const vars = getThemeCssVars(mode);
  Object.entries(vars).forEach(([key, value]) => {
    el.style.setProperty(key, value);
  });
}

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
