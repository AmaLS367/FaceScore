import { afterEach, describe, expect, it, vi } from 'vitest';
import * as tauriHttp from '@tauri-apps/plugin-http';

import type { ClaudeImagePayload } from '../domain/analysis';
import { fixtureReport } from '../domain/fixtureReport';
import { analyzeFace } from './anthropicClient';

vi.mock('@tauri-apps/plugin-http', () => ({
  fetch: vi.fn(),
}));

const image: ClaudeImagePayload = {
  media_type: 'image/jpeg',
  data: 'ZmFjZQ==',
};

function mockResponse(response: { ok: boolean; status?: number; json: () => Promise<unknown> }): Response {
  return response as Response;
}

describe('analyzeFace', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls Anthropic Messages API and parses a valid report', async () => {
    const fetchMock = vi.mocked(tauriHttp.fetch).mockResolvedValue(mockResponse({
      ok: true,
      json: async () => ({
        content: [{ type: 'tool_use', name: 'generate_report', input: fixtureReport }],
      }),
    }));

    const report = await analyzeFace({ apiKey: 'sk-ant-testkey-1234567890', image });

    expect(report.overallScore.value).toBe(82);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'x-api-key': 'sk-ant-testkey-1234567890',
        }),
        body: expect.stringContaining('"model":"claude-sonnet-4-20250514"'),
      }),
    );
    expect(fetchMock.mock.calls[0]?.[1]?.headers).not.toHaveProperty('anthropic-dangerous-direct-browser-access');
  });

  it('throws a clear error for API failures', async () => {
    vi.mocked(tauriHttp.fetch).mockResolvedValue(mockResponse({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: 'rate limited' } }),
    }));

    await expect(analyzeFace({ apiKey: 'sk-ant-testkey-1234567890', image })).rejects.toThrow(
      'Rate limit exceeded or insufficient quota. Please try again later.',
    );
  });

  it('throws a clear error when Claude returns no text block', async () => {
    vi.mocked(tauriHttp.fetch).mockResolvedValue(mockResponse({
      ok: true,
      json: async () => ({ content: [] }),
    }));

    await expect(analyzeFace({ apiKey: 'sk-ant-testkey-1234567890', image })).rejects.toThrow(
      'Analysis service response was empty or incorrectly formatted.',
    );
  });
});
