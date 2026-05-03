import { beforeEach, describe, expect, it } from 'vitest';

import { clearApiKey, loadApiKey, saveApiKey } from './apiKeyStore';

describe('apiKeyStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads a trimmed API key', () => {
    saveApiKey('  sk-ant-testkey-1234567890  ');
    expect(loadApiKey()).toBe('sk-ant-testkey-1234567890');
  });

  it('clears the stored API key', () => {
    saveApiKey('sk-ant-testkey-1234567890');
    clearApiKey();
    expect(loadApiKey()).toBe('');
  });
});
