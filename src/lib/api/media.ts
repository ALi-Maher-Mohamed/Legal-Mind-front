import { env } from '@/config/env';

export function resolveMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  return `${env.apiBaseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}
