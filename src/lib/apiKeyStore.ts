import { invoke } from '@tauri-apps/api/core';

export type ApiKeyStatus = 'checking' | 'present' | 'missing';

export async function isValidApiKeyFormat(key: string): Promise<boolean> {
  return invoke<boolean>('validate_api_key_format', { key });
}

export async function hasApiKey(): Promise<boolean> {
  return invoke<boolean>('has_api_key');
}

export async function saveApiKey(apiKey: string): Promise<void> {
  const trimmed = apiKey.trim();
  try {
    await invoke('save_api_key', { key: trimmed });
  } catch (error) {
    throw new Error(typeof error === 'string' ? error : 'Invalid API key format', { cause: error });
  }
}

export async function clearApiKey(): Promise<void> {
  await invoke('clear_api_key');
}
