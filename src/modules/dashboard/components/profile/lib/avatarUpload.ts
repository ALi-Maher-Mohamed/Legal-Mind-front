const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 2 * 1024 * 1024;

export function validateAvatarFile(file: File): string | null {
  if (!ACCEPTED_TYPES.has(file.type)) {
    return 'avatarTypeError';
  }
  if (file.size > MAX_BYTES) {
    return 'avatarSizeError';
  }
  return null;
}

export const AVATAR_ACCEPT = 'image/jpeg,image/png,image/webp';
