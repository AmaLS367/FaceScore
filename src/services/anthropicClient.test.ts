import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ClaudeImagePayload } from '../domain/analysis';
import { fixtureReport } from '../domain/fixtureReport';
import { analyzeFace } from './anthropicClient';

const image: ClaudeImagePayload = {
  media_type: 'image/jpeg',
  data: 'ZmFjZQ==',
};

describe('analyzeFace', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls Anthropic Messages API and parses a valid report', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ content: [{ type: 'text', text: JSON.stringify(fixtureReport) }] }), {
        status: 200,
      }),
    );

    const report = await analyzeFace({ apiKey: 'sk-ant-test', image });

    expect(report.overallScore.value).toBe(82);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.anthropic.com/v1/messages',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'anthropic-dangerous-direct-browser-access': 'true',
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'x-api-key': 'sk-ant-test',
        }),
      }),
    );
  });

  it('throws a clear error for API failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('rate limited', { status: 429 }));

    await expect(analyzeFace({ apiKey: 'sk-ant-test', image })).rejects.toThrow(
      'Claude API request failed with status 429.',
    );
  });

  it('throws a clear error when Claude returns no text block', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ content: [] }), { status: 200 }));

    await expect(analyzeFace({ apiKey: 'sk-ant-test', image })).rejects.toThrow(
      'Claude response did not include a text report.',
    );
  });
});
