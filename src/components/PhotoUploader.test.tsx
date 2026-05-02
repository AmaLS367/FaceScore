import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PhotoUploader } from './PhotoUploader';

describe('PhotoUploader', () => {
  it('passes an accepted image to onSelect', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<PhotoUploader error={null} file={null} onClear={vi.fn()} onError={vi.fn()} onSelect={onSelect} />);

    const file = new File(['image'], 'face.jpg', { type: 'image/jpeg' });
    await user.upload(screen.getByLabelText(/Choose face photo/i), file);

    expect(onSelect).toHaveBeenCalledWith(file);
  });

  it('shows selected file details and allows clearing', async () => {
    const onClear = vi.fn();
    const file = new File(['image'], 'face.webp', { type: 'image/webp' });

    render(<PhotoUploader error={null} file={file} onClear={onClear} onError={vi.fn()} onSelect={vi.fn()} />);

    expect(screen.getByText('face.webp')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Clear selected photo/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('reports unsupported files', async () => {
    const onError = vi.fn();
    const user = userEvent.setup({ applyAccept: false });
    render(<PhotoUploader error={null} file={null} onClear={vi.fn()} onError={onError} onSelect={vi.fn()} />);

    await user.upload(screen.getByLabelText(/Choose face photo/i), new File(['text'], 'notes.txt', { type: 'text/plain' }));

    expect(onError).toHaveBeenCalledWith('Use a JPG, PNG, or WebP image.');
  });
});
