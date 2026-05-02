const API_KEY_STORAGE_KEY = 'facescore.anthropicApiKey';

export function loadApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE_KEY) ?? '';
}

export function saveApiKey(apiKey: string): void {
  const trimmed = apiKey.trim();

  if (!trimmed) {
    clearApiKey();
    return;
  }

  localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}
