import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import App from './App';
import { fixtureReport } from './domain/fixtureReport';

describe('App', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the FaceScore shell with empty analysis state', () => {
    render(<App />);

    expect(screen.getByText('FaceScore')).toBeInTheDocument();
    // Use a function matcher for text broken by HTML tags
    expect(screen.getByText((_content, element) => {
      return element?.textContent === 'Appearance &Presentation Report';
    })).toBeInTheDocument();
  });

  it('keeps analysis disabled until an API key and image are present', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /Analyze face/i })).toBeDisabled();
    expect(screen.getByText('Awaiting image')).toBeInTheDocument();
    
    // Multiple matches for "Add your Anthropic API key", check the nudge Specifically
    const nudge = screen.queryByText(/Add your Anthropic API key to enable analysis/i);
    expect(nudge).toBeInTheDocument();
  });

  it('runs the full mocked analysis workflow', async () => {
    vi.spyOn(window, 'print').mockImplementation(() => undefined);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(fixtureReport) }] }), {
        status: 200,
      }),
    );
    const user = userEvent.setup();
    render(<App />);

    // Open settings to set API key
    await user.click(screen.getByRole('button', { name: /API Key/i }));
    await user.type(screen.getByLabelText(/Anthropic API key/i), 'sk-ant-test');
    await user.click(screen.getByRole('button', { name: /Save API key/i }));
    // Go back
    await user.click(screen.getByRole('button', { name: /Back to Analysis/i }));

    await user.upload(screen.getByLabelText(/Choose face photo/i), new File(['face'], 'face.jpg', { type: 'image/jpeg' }));
    await user.click(screen.getByRole('button', { name: /Analyze face/i }));

    expect(await screen.findByText(/Strong baseline/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analyze face/i })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: /Export PDF/i }));
    expect(window.print).toHaveBeenCalledOnce();
  });
});
