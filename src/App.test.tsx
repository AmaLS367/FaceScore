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

    expect(screen.getByRole('heading', { name: 'FaceScore' })).toBeInTheDocument();
    expect(screen.getByText(/Upload a photo and save an API key/i)).toBeInTheDocument();
  });

  it('keeps analysis disabled until an API key and image are present', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /Analyze face/i })).toBeDisabled();
  });

  it('runs the full mocked analysis workflow', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(fixtureReport) }] }), {
        status: 200,
      }),
    );
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/Anthropic API key/i), 'sk-ant-test');
    await user.click(screen.getByRole('button', { name: /Save API key/i }));
    await user.upload(screen.getByLabelText(/Choose face photo/i), new File(['face'], 'face.jpg', { type: 'image/jpeg' }));
    await user.click(screen.getByRole('button', { name: /Analyze face/i }));

    expect(await screen.findByRole('heading', { name: /Strong baseline/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analyze face/i })).toBeEnabled();
  });
});
