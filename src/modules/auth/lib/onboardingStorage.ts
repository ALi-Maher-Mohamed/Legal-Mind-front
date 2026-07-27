const STORAGE_KEY = 'legalmind_onboarding_done';

function canUseDom() {
  return typeof window !== 'undefined';
}

function readCompletedIds(): string[] {
  if (!canUseDom()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeCompletedIds(ids: string[]) {
  if (!canUseDom()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function hasCompletedOnboarding(userId: string): boolean {
  if (!userId) return false;
  return readCompletedIds().includes(userId);
}

export function markOnboardingCompleted(userId: string) {
  if (!userId || !canUseDom()) return;
  const ids = readCompletedIds();
  if (ids.includes(userId)) return;
  writeCompletedIds([...ids, userId]);
}
