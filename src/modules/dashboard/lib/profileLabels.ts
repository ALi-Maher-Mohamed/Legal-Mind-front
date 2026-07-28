const TEAM_SIZE_LABELS: Record<string, string> = {
  solo: 'فردي (محامٍ واحد)',
  small: 'مكتب صغير (1-5 أفراد)',
  medium: 'مكتب متوسط (6-20 فرد)',
  large: 'مكتب كبير (+20 فرد)',
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

export function formatProfileDateOnly(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatProfileTimeOnly(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? 'منذ ساعة' : `منذ ${hours} ساعات`;
  const days = Math.floor(hours / 24);
  if (days < 30) return days === 1 ? 'منذ يوم' : `منذ ${days} أيام`;
  return formatProfileDateOnly(value);
}

export function roleLabel(role?: string) {
  if (role === 'lawyer') return 'محامٍ معتمد';
  if (role === 'user') return 'مستخدم';
  return role || '—';
}
