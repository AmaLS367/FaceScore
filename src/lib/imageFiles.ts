import type { ClaudeImagePayload } from '../domain/analysis';

export const ACCEPTED_IMAGE_TYPES: ClaudeImagePayload['media_type'][] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type ImageValidationResult = { ok: true } | { ok: false; message: string };

export async function validateImageFile(file: File): Promise<ImageValidationResult> {
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: 'Use an image up to 5 MB.' };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as ClaudeImagePayload['media_type'])) {
    return { ok: false, message: 'Use a JPG, PNG, or WebP image.' };
  }

  // Validate magic bytes
  const buffer = await file.slice(0, 12).arrayBuffer();
  const arr = new Uint8Array(buffer);
  
  let isJpeg = arr[0] === 0xFF && arr[1] === 0xD8 && arr[2] === 0xFF;
  let isPng = arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47;
  let isWebp = arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46 && 
               arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50; // RIFF...WEBP

  if (!isJpeg && !isPng && !isWebp) {
    return { ok: false, message: 'Invalid image format. Ensure it is a true JPG, PNG, or WebP.' };
  }

  return { ok: true };
}

export async function toClaudeImagePayload(file: File): Promise<ClaudeImagePayload> {
  const validation = await validateImageFile(file);
  if (!validation.ok) {
    throw new Error(validation.message);
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
