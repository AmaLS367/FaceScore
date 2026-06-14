import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { invoke } from '@tauri-apps/api/core';

import App from './App';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

function mockInvoke(options: { hasApiKey?: boolean; analysisPayload?: unknown; analysisError?: string } = {}) {
  vi.mocked(invoke).mockImplementation(async (command) => {
    if (command === 'has_api_key') {
      return options.hasApiKey ?? false;
    }
    if (command === 'save_api_key' || command === 'clear_api_key') {
      return undefined;
    }
    if (command === 'analyze_face') {
      if (options.analysisError) {
        throw options.analysisError;
      }
      return options.analysisPayload ?? { content: [] };
    }
    throw new Error(`Unexpected command: ${command}`);
  });
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
  beforeEach(() => {
    mockInvoke();
  });

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

  it('enables analysis after restart when the OS credential store has a key', async () => {
    mockInvoke({ hasApiKey: true });

    const user = userEvent.setup();
    render(<App />);

    await uploadPhoto(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Analyze face/i })).toBeEnabled();
    });
    expect(screen.queryByText(/Add your Anthropic API key to enable analysis/i)).not.toBeInTheDocument();
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
    mockInvoke({
      analysisError: 'Analysis service rejected the request (500). Please try again later.',
    });

    const user = userEvent.setup();
    render(<App />);

    await saveApiKey(user);
    await uploadPhoto(user);
    await user.click(screen.getByRole('button', { name: /Analyze face/i }));

    expect(await screen.findByText(/Analysis service rejected the request/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Export PDF/i })).not.toBeInTheDocument();
  });

  it('renders a fallback report for partial Claude JSON', async () => {
    mockInvoke({
      analysisPayload: {
        content: [{ type: 'tool_use', name: 'generate_report', input: { overallScore: 100 } }],
      },
    });

    const user = userEvent.setup();
    render(<App />);

    await saveApiKey(user);
    await uploadPhoto(user);
    await user.click(screen.getByRole('button', { name: /Analyze face/i }));

    expect(await screen.findByText(/Photo-based estimate/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export PDF/i })).toBeInTheDocument();
  });
});
