import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { invoke } from '@tauri-apps/api/core';

import App from './App';
import { fixtureReport } from './domain/fixtureReport';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

function mockInvoke(options: { hasApiKey?: boolean; analysisPayload?: unknown } = {}) {
  vi.mocked(invoke).mockImplementation(async (command, args?: unknown) => {
    if (command === 'has_api_key') {
      return options.hasApiKey ?? false;
    }
    if (command === 'save_api_key' || command === 'clear_api_key') {
      return undefined;
    }
    if (command === 'validate_api_key_format') {
      const keyObj = args as { key?: string } | undefined;
      return keyObj?.key?.startsWith('sk-ant-') ?? false;
    }
    if (command === 'analyze_face') {
      return options.analysisPayload ?? { content: [] };
    }
    throw new Error(`Unexpected command: ${command}`);
  });
}

describe('App', () => {
  beforeEach(() => {
    mockInvoke();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the FaceScore shell with empty analysis state', async () => {
    render(<App />);

    expect(screen.getByText('FaceScore')).toBeInTheDocument();
    // Use a function matcher for text broken by HTML tags
    expect(screen.getByText((_content, element) => {
      return element?.textContent === 'Appearance &Presentation Report';
    })).toBeInTheDocument();
    expect(await screen.findByText(/Add your Anthropic API key to enable analysis/i)).toBeInTheDocument();
  });

  it('keeps analysis disabled until an API key and image are present', async () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /Analyze face/i })).toBeDisabled();
    expect(screen.getByText('Awaiting image')).toBeInTheDocument();
    
    // Multiple matches for "Add your Anthropic API key", check the nudge Specifically
    const nudge = await screen.findByText(/Add your Anthropic API key to enable analysis/i);
    expect(nudge).toBeInTheDocument();
  });

  it('runs the full mocked analysis workflow', async () => {
    vi.spyOn(window, 'print').mockImplementation(() => undefined);
    mockInvoke({
      analysisPayload: {
        content: [{ type: 'tool_use', name: 'generate_report', input: fixtureReport }],
      },
    });

    const user = userEvent.setup();
    render(<App />);

    // Open settings to set API key
    await user.click(screen.getByRole('button', { name: /API Key/i }));
    await user.type(screen.getByLabelText(/Anthropic API key/i), 'sk-ant-testkey-1234567890');
    await user.click(screen.getByRole('button', { name: /Save API key/i }));
    // Go back
    await user.click(screen.getByRole('button', { name: /Back to Analysis/i }));

    const jpegMagic = new Uint8Array([0xFF, 0xD8, 0xFF]);
    await user.upload(screen.getByLabelText(/Choose face photo/i), new File([jpegMagic, new Uint8Array(10)], 'face.jpg', { type: 'image/jpeg' }));
    await user.click(screen.getByRole('button', { name: /Analyze face/i }));

    expect(await screen.findByText(/Strong baseline/i)).toBeInTheDocument();
    expect(invoke).toHaveBeenCalledWith('save_api_key', { key: 'sk-ant-testkey-1234567890' });
    expect(invoke).toHaveBeenCalledWith('analyze_face', expect.objectContaining({
      image: expect.objectContaining({ media_type: 'image/jpeg' }),
      prompt: expect.any(String),
    }));
    expect(JSON.stringify(vi.mocked(invoke).mock.calls.filter(([command]) => command === 'analyze_face'))).not.toContain('sk-ant-');
    expect(screen.getByRole('button', { name: /Analyze face/i })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /Export PDF/i }));
    expect(window.print).toHaveBeenCalledOnce();
  });
});
