import { afterEach, describe, expect, it, vi } from 'vitest';
import { invoke } from '@tauri-apps/api/core';

import type { ClaudeImagePayload } from '../domain/analysis';
import { fixtureReport } from '../domain/fixtureReport';
import { analyzeFace } from './anthropicClient';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

const image: ClaudeImagePayload = {
  media_type: 'image/jpeg',
  data: 'ZmFjZQ==',
};

describe('analyzeFace', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls the Tauri analysis command and parses a valid report', async () => {
    const invokeMock = vi.mocked(invoke).mockResolvedValue({
      content: [{ type: 'tool_use', name: 'generate_report', input: fixtureReport }],
    });

    const report = await analyzeFace({ image });

    expect(report.overallScore.value).toBe(82);
    expect(invokeMock).toHaveBeenCalledWith('analyze_face', expect.objectContaining({
      image,
      prompt: expect.stringContaining('Create a clean, minimal'),
    }));
    expect(JSON.stringify(invokeMock.mock.calls[0])).not.toContain('sk-ant-');
  });

  it('throws a clear error for API failures', async () => {
    vi.mocked(invoke).mockRejectedValue('Rate limit exceeded or insufficient quota. Please try again later.');

    await expect(analyzeFace({ image })).rejects.toThrow(
      'Rate limit exceeded or insufficient quota. Please try again later.',
    );
  });

  it('includes the Anthropic authentication error detail when available', async () => {
    vi.mocked(invoke).mockRejectedValue('Authentication failed: invalid x-api-key');

    await expect(analyzeFace({ image })).rejects.toThrow(
      'Authentication failed: invalid x-api-key',
    );
  });

  it('renders a fallback report when Claude returns no tool block', async () => {
    vi.mocked(invoke).mockResolvedValue({ content: [] });

    const report = await analyzeFace({ image });

    expect(report.overallScore.label).toBe('Photo-based estimate');
    expect(report.scoreCategories).toHaveLength(5);
  });
});
