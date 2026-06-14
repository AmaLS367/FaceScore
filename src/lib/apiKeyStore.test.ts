import { beforeEach, describe, expect, it, vi } from 'vitest';
import { invoke } from '@tauri-apps/api/core';

import { clearApiKey, hasApiKey, saveApiKey } from './apiKeyStore';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('apiKeyStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks whether an API key exists in the OS credential store', async () => {
    vi.mocked(invoke).mockResolvedValue(true);

    await expect(hasApiKey()).resolves.toBe(true);
    expect(invoke).toHaveBeenCalledWith('has_api_key');
  });

  it('saves a trimmed API key via Tauri', async () => {
    vi.mocked(invoke).mockResolvedValue(undefined);

    await saveApiKey('  sk-ant-testkey-1234567890  ');

    expect(invoke).toHaveBeenCalledWith('save_api_key', { key: 'sk-ant-testkey-1234567890' });
  });

  it('rejects invalid API key formats before invoking Tauri', async () => {
    await expect(saveApiKey('invalid')).rejects.toThrow('Invalid API key format');
    expect(invoke).not.toHaveBeenCalled();
  });

  it('clears the stored API key via Tauri', async () => {
    vi.mocked(invoke).mockResolvedValue(undefined);

    await clearApiKey();

    expect(invoke).toHaveBeenCalledWith('clear_api_key');
  });
});
