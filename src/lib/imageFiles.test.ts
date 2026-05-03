import { describe, expect, it } from 'vitest';

import { toClaudeImagePayload, validateImageFile } from './imageFiles';

const jpegMagic = new Uint8Array([0xFF, 0xD8, 0xFF]);
const pngMagic = new Uint8Array([0x89, 0x50, 0x4E, 0x47]);

describe('validateImageFile', () => {
  it('accepts supported face photo formats', async () => {
    const file = new File([pngMagic, new Uint8Array(20)], 'face.png', { type: 'image/png' });

    expect(await validateImageFile(file)).toEqual({ ok: true });
  });

  it('rejects unsupported file types with a user-facing message', async () => {
    const file = new File(['text'], 'notes.txt', { type: 'text/plain' });

    expect(await validateImageFile(file)).toEqual({
      ok: false,
      message: 'Use a JPG, PNG, or WebP image.',
    });
  });

  it('converts an accepted image file to a raw base64 Claude payload', async () => {
    const file = new File([jpegMagic, new Uint8Array([0x00])], 'face.jpg', { type: 'image/jpeg' });

    await expect(toClaudeImagePayload(file)).resolves.toEqual({
      media_type: 'image/jpeg',
      data: '/9j/AA==',
    });
  });
});