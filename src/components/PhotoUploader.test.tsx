import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PhotoUploader } from './PhotoUploader';

const jpegMagic = new Uint8Array([0xFF, 0xD8, 0xFF]);

describe('PhotoUploader', () => {
  it('passes an accepted image to onSelect', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<PhotoUploader file={null} onClear={vi.fn()} onError={vi.fn()} onSelect={onSelect} previewUrl={null} />);

    const file = new File([jpegMagic, new Uint8Array(10)], 'face.jpg', { type: 'image/jpeg' });
    await user.upload(screen.getByLabelText(/Choose face photo/i), file);

    expect(onSelect).toHaveBeenCalledWith(file);
  });

  it('shows selected file details and allows clearing', async () => {
    const onClear = vi.fn();
    const file = new File([jpegMagic], 'face.jpg', { type: 'image/jpeg' });

    render(<PhotoUploader file={file} onClear={onClear} onError={vi.fn()} onSelect={vi.fn()} previewUrl={null} />);

    expect(screen.getByText('face.jpg')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '×' }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('reports unsupported files', async () => {
    const onError = vi.fn();
    const user = userEvent.setup({ applyAccept: false });
    render(<PhotoUploader file={null} onClear={vi.fn()} onError={onError} onSelect={vi.fn()} previewUrl={null} />);

    await user.upload(screen.getByLabelText(/Choose face photo/i), new File(['text'], 'notes.txt', { type: 'text/plain' }));

    expect(onError).toHaveBeenCalledWith('Use a JPG, PNG, or WebP image.');
  });
});