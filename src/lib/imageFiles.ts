import type { ClaudeImagePayload } from '../domain/analysis';

export const ACCEPTED_IMAGE_TYPES: ClaudeImagePayload['media_type'][] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type ImageValidationResult = { ok: true } | { ok: false; message: string };

export function validateImageFile(file: File): ImageValidationResult {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as ClaudeImagePayload['media_type'])) {
    return { ok: false, message: 'Use a JPG, PNG, or WebP image.' };
  }

  return { ok: true };
}

export async function toClaudeImagePayload(file: File): Promise<ClaudeImagePayload> {
  const validation = validateImageFile(file);
  if (!validation.ok) {
    throw new Error(validation.message);
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Use an image up to 5 MB.');
  }

  const dataUrl = await readAsDataUrl(file);
  const [, data] = dataUrl.split(',');

  if (!data) {
    throw new Error('Could not read image data.');
  }

  return {
    media_type: file.type as ClaudeImagePayload['media_type'],
    data,
  };
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image data.'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
