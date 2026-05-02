import { describe, expect, it } from 'vitest';

import { MAX_IMAGE_BYTES, toClaudeImagePayload, validateImageFile } from './imageFiles';

describe('validateImageFile', () => {
  it('accepts supported face photo formats', () => {
    const file = new File(['image'], 'face.png', { type: 'image/png' });

    expect(validateImageFile(file)).toEqual({ ok: true });
  });

  it('rejects unsupported file types with a user-facing message', () => {
    const file = new File(['text'], 'notes.txt', { type: 'text/plain' });

    expect(validateImageFile(file)).toEqual({
      ok: false,
      message: 'Use a JPG, PNG, or WebP image.',
    });
  });

  it('converts an accepted image file to a raw base64 Claude payload', async () => {
    const file = new File(['face'], 'face.jpg', { type: 'image/jpeg' });

    await expect(toClaudeImagePayload(file)).resolves.toEqual({
      media_type: 'image/jpeg',
      data: 'ZmFjZQ==',
    });
  });

  it('rejects supported images above the MVP size guard', async () => {
    const file = new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], 'large.png', { type: 'image/png' });

    await expect(toClaudeImagePayload(file)).rejects.toThrow('Use an image up to 5 MB.');
  });
});
