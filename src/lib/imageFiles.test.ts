import { describe, expect, it } from 'vitest';

import { validateImageFile } from './imageFiles';

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
});
