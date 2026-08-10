/**
 * JurisTech Precision tokens — single source from DESIGN.md (dark) + DESIGN light.
 *
 * Tailwind: bg-background text-foreground bg-card text-brand border-outline
 */

export type ThemeMode = 'light' | 'dark';

/** Raw Material-style palette from design system docs */
export const palette = {
  light: {
    /** Cool blue-gray floor (page canvas) — easy on the eyes */
    background: '#e4e9f2',
    surface: '#eaeff6',
    surfaceDim: '#c5cedc',
    surfaceBright: '#f0f3f8',
    /** Soft paper — never pure #ffffff */
    surfaceLowest: '#f3f5f9',
    surfaceLow: '#e8edf5',
    surfaceContainer: '#dfe6f0',
    surfaceHigh: '#d7dfeb',
    surfaceHighest: '#cfd8e6',
    onSurface: '#1a1d24',
    onSurfaceVariant: '#4a5060',
    outline: '#b8c1d1',
    outlineStrong: '#6b7285',
    primary: '#003ec7',
    onPrimary: '#f7f9fc',
    primaryContainer: '#0052ff',
    secondary: '#565e74',
    tertiary: '#3f4f65',
    error: '#ba1a1a',
    inverseSurface: '#2d3133',
  },
  /**
   * Midnight Navy — one hue family (~222°) from page floor to raised cards.
   * Buttons: royal blue. Highlights: gold. Everything else: navy steps.
   */
  dark: {
    background: '#070d1d',
    surface: '#070d1d',
    surfaceDim: '#070d1d',
    surfaceBright: '#28375a',
    surfaceLowest: '#050a17',
    surfaceLow: '#0d1528',
    surfaceContainer: '#101a30',
    surfaceHigh: '#16223c',
    surfaceHighest: '#1d2b49',
    onSurface: '#e6edfc',
    onSurfaceVariant: '#9dabc9',
    outline: '#26344f',
    outlineStrong: '#48597c',
    primary: '#4d7ef7',
    onPrimary: '#f4f7ff',
    primaryContainer: '#1c3468',
    secondary: '#8fb0f9',
    tertiary: '#f2c14e',
    error: '#f87171',
    inverseSurface: '#e6edfc',
  },
} as const;

/** Semantic tokens used by CSS vars + components */
export const themes = {
  light: {
    background: palette.light.background,
    foreground: palette.light.onSurface,
    /** Soft elevated paper (cards) vs cooler page canvas */
    card: palette.light.surfaceLowest,
    surface: palette.light.surfaceLowest,
    surfaceRaised: palette.light.surfaceLow,
    surfaceMuted: palette.light.surfaceContainer,
    border: '#b9c3d4',
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
    selection: 'rgba(0, 62, 199, 0.14)',
    scrollbarTrack: palette.light.surfaceLow,
    scrollbarThumb: '#9aabc4',
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
    /** Buttons & primary actions — royal blue */
    brand: palette.dark.primary,
    brandSoft: palette.dark.primaryContainer,
    /** Lighter blue for text-on-navy secondary emphasis */
    brandDeep: '#7ba1f9',
    onBrand: palette.dark.onPrimary,
    /** Gold highlights — badges, active markers */
    accent: palette.dark.tertiary,
    accentPurple: palette.dark.secondary,
    success: '#34d399',
    warning: palette.dark.tertiary,
    danger: palette.dark.error,
    ring: palette.dark.primary,
    selection: 'rgba(77, 126, 247, 0.25)',
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

  /**
   * Soften Tailwind `bg-white` / default white mixes in light only.
   * `text-on-brand` stays readable; pure #fff reserved for dark overlays.
   */
  if (mode === 'light') {
    vars['--lm-white'] = palette.light.surfaceLowest;
    vars['--color-white'] = palette.light.surfaceLowest;
    vars['--lm-card-shadow'] =
      '0 1px 2px rgba(28, 45, 80, 0.04), 0 4px 16px rgba(28, 45, 80, 0.07)';
    vars['--lm-card-shadow-md'] =
      '0 2px 4px rgba(28, 45, 80, 0.05), 0 8px 24px rgba(28, 45, 80, 0.08)';
  } else {
    vars['--lm-white'] = '#ffffff';
    vars['--color-white'] = '#ffffff';
    vars['--lm-card-shadow'] = 'none';
    vars['--lm-card-shadow-md'] = 'none';
  }

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
