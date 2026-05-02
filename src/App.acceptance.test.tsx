import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import App from './App';

async function saveApiKey(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Anthropic API key/i), 'sk-ant-test');
  await user.click(screen.getByRole('button', { name: /Save API key/i }));
}

async function uploadPhoto(user: ReturnType<typeof userEvent.setup>) {
  await user.upload(screen.getByLabelText(/Choose face photo/i), new File(['face'], 'face.jpg', { type: 'image/jpeg' }));
}

describe('FaceScore MVP acceptance regressions', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('does not show PDF export before a successful analysis', () => {
    render(<App />);

    expect(screen.queryByRole('button', { name: /Export PDF/i })).not.toBeInTheDocument();
  });

  it('keeps analyze disabled when only a photo is selected', async () => {
    const user = userEvent.setup();
    render(<App />);

    await uploadPhoto(user);

    expect(screen.getByRole('button', { name: /Analyze face/i })).toBeDisabled();
  });

  it('keeps analyze disabled when only an API key is saved', async () => {
    const user = userEvent.setup();
    render(<App />);

    await saveApiKey(user);

    expect(screen.getByRole('button', { name: /Analyze face/i })).toBeDisabled();
  });

  it('shows a validation error for unsupported image uploads', async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<App />);

    await user.upload(screen.getByLabelText(/Choose face photo/i), new File(['text'], 'notes.txt', { type: 'text/plain' }));

    expect(screen.getByText('Use a JPG, PNG, or WebP image.')).toBeInTheDocument();
  });

  it('shows a clear API error and leaves the report empty on Claude API failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('server error', { status: 500 }));
    const user = userEvent.setup();
    render(<App />);

    await saveApiKey(user);
    await uploadPhoto(user);
    await user.click(screen.getByRole('button', { name: /Analyze face/i }));

    expect(await screen.findByText('Claude API request failed with status 500.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Export PDF/i })).not.toBeInTheDocument();
  });

  it('shows a schema error for invalid Claude JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ content: [{ type: 'text', text: JSON.stringify({ overallScore: 100 }) }] }), {
        status: 200,
      }),
    );
    const user = userEvent.setup();
    render(<App />);

    await saveApiKey(user);
    await uploadPhoto(user);
    await user.click(screen.getByRole('button', { name: /Analyze face/i }));

    expect(await screen.findByText('Claude response did not match the FaceScore report schema.')).toBeInTheDocument();
  });
});
