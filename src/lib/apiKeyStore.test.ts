import { beforeEach, describe, expect, it } from 'vitest';

import { clearApiKey, loadApiKey, saveApiKey } from './apiKeyStore';

describe('apiKeyStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads a trimmed API key', () => {
    saveApiKey('  sk-ant-test  ');

    expect(loadApiKey()).toBe('sk-ant-test');
  });

  it('clears the stored API key', () => {
    saveApiKey('sk-ant-test');
    clearApiKey();

    expect(loadApiKey()).toBe('');
  });
});
