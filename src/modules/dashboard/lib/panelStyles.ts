/** Shared dashboard surfaces — light soft paper / dark tokens unchanged */

/** Soft elevated card shadow (light only; dark disables) */
export const dashCardShadow =
  'shadow-[0_1px_2px_rgba(20,40,80,0.04),0_4px_14px_rgba(20,40,80,0.08)] dark:shadow-none';

export const dashPanel =
  `rounded-2xl border border-brand/15 bg-card ${dashCardShadow} dark:border-white/10 dark:bg-[rgba(23,31,51,0.85)] dark:backdrop-blur-[6px]`;

export const dashPanelPad = `${dashPanel} p-5 sm:p-6`;

export const dashChip =
  'rounded-lg border border-brand/15 bg-surface-raised dark:border-white/10 dark:bg-white/5';

export const dashAccentBar = 'absolute inset-y-0 start-0 w-1 bg-brand';

export const dashAccentBarGold = 'absolute inset-y-0 end-0 w-1 bg-accent';

export const dashPageBg = 'bg-background';

export const dashSidebar =
  'border-e border-brand/15 bg-card dark:border-white/10 dark:bg-card';
