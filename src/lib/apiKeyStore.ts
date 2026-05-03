let memoryApiKey = '';

export function loadApiKey(): string {
  return memoryApiKey;
}

export function isValidApiKeyFormat(key: string): boolean {
  // Best practice: Anthropic keys start with sk-ant- (or specifically sk-ant-api03-)
  return /^sk-ant-[a-zA-Z0-9\-_]{16,128}$/.test(key);
}

export function saveApiKey(apiKey: string): void {
  const trimmed = apiKey.trim();

  if (!trimmed) {
    clearApiKey();
    return;
  }

  if (!isValidApiKeyFormat(trimmed)) {
    throw new Error('Invalid API key format');
  }

  memoryApiKey = trimmed;
}

export function clearApiKey(): void {
  memoryApiKey = '';
}
