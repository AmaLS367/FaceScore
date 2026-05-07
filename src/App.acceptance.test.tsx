import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as tauriHttp from '@tauri-apps/plugin-http';

import App from './App';

vi.mock('@tauri-apps/plugin-http', () => ({
  fetch: vi.fn(),
}));

function mockResponse(response: { ok: boolean; status?: number; json: () => Promise<unknown> }): Response {
  return response as Response;
}

async function saveApiKey(user: ReturnType<typeof userEvent.setup>) {
  // Open settings to set API key
  await user.click(screen.getByRole('button', { name: /API Key/i }));
  await user.type(screen.getByLabelText(/Anthropic API key/i), 'sk-ant-testkey-1234567890');
  await user.click(screen.getByRole('button', { name: /Save API key/i }));
  // Go back
  await user.click(screen.getByRole('button', { name: /Back to Analysis/i }));
}

async function uploadPhoto(user: ReturnType<typeof userEvent.setup>) {
  const jpegMagic = new Uint8Array([0xFF, 0xD8, 0xFF]);
  await user.upload(screen.getByLabelText(/Choose face photo/i), new File([jpegMagic, new Uint8Array(10)], 'face.jpg', { type: 'image/jpeg' }));
}

describe('FaceScore MVP acceptance regressions', () => {
  afterEach(() => {
    vi.clearAllMocks();
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
    vi.mocked(tauriHttp.fetch).mockResolvedValue(mockResponse({
      ok: false,
      status: 500,
      json: async () => ({ error: { message: 'server error' } }),
    }));

    const user = userEvent.setup();
    render(<App />);

    await saveApiKey(user);
    await uploadPhoto(user);
    await user.click(screen.getByRole('button', { name: /Analyze face/i }));

    expect(await screen.findByText(/Analysis service rejected the request/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Export PDF/i })).not.toBeInTheDocument();
  });

  it('renders a fallback report for partial Claude JSON', async () => {
    vi.mocked(tauriHttp.fetch).mockResolvedValue(mockResponse({
      ok: true,
      json: async () => ({
        content: [{ type: 'tool_use', name: 'generate_report', input: { overallScore: 100 } }],
      }),
    }));

    const user = userEvent.setup();
    render(<App />);

    await saveApiKey(user);
    await uploadPhoto(user);
    await user.click(screen.getByRole('button', { name: /Analyze face/i }));

    expect(await screen.findByText(/Photo-based estimate/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export PDF/i })).toBeInTheDocument();
  });
});
