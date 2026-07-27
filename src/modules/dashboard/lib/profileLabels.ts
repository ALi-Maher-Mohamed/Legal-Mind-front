const TEAM_SIZE_LABELS: Record<string, string> = {
  solo: 'فردي',
  small: 'صغير',
  medium: 'متوسط',
  large: 'كبير',
};

export function teamSizeLabel(value?: string) {
  if (!value) return '—';
  return TEAM_SIZE_LABELS[value] || value;
}

export function formatProfileDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function roleLabel(role?: string) {
  if (role === 'lawyer') return 'محامٍ';
  if (role === 'user') return 'مستخدم';
  return role || '—';
}
