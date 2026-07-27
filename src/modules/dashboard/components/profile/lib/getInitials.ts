export function getInitials(name?: string) {
  const value = (name || 'م').trim();
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}
