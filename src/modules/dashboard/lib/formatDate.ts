export function formatLocaleDate(alt = false) {
  const d = new Date();
  return d.toLocaleDateString(alt ? 'en-US' : 'ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
