import type { ClaudeImagePayload } from '../domain/analysis';

export const ACCEPTED_IMAGE_TYPES: ClaudeImagePayload['media_type'][] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export type ImageValidationResult = { ok: true } | { ok: false; message: string };

export function validateImageFile(file: File): ImageValidationResult {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as ClaudeImagePayload['media_type'])) {
    return { ok: false, message: 'Use a JPG, PNG, or WebP image.' };
  }

  return { ok: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
