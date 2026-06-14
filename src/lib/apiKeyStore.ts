import { invoke } from '@tauri-apps/api/core';

export type ApiKeyStatus = 'checking' | 'present' | 'missing';

export function isValidApiKeyFormat(key: string): boolean {
  // Best practice: Anthropic keys start with sk-ant- (or specifically sk-ant-api03-)
  return /^sk-ant-[a-zA-Z0-9\-_]{16,128}$/.test(key);
}

export async function hasApiKey(): Promise<boolean> {
  return invoke<boolean>('has_api_key');
}

export async function saveApiKey(apiKey: string): Promise<void> {
  const trimmed = apiKey.trim();

  if (!isValidApiKeyFormat(trimmed)) {
    throw new Error('Invalid API key format');
  }

  await invoke('save_api_key', { key: trimmed });
}

export async function clearApiKey(): Promise<void> {
  await invoke('clear_api_key');
}
