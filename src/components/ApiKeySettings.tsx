import { useState } from 'react';
import { isValidApiKeyFormat } from '../lib/apiKeyStore';

interface ApiKeySettingsProps {
  disabled?: boolean;
  hasApiKey: boolean;
  onClear: () => Promise<void>;
  onSave: (apiKey: string) => Promise<void>;
}

export function ApiKeySettings({ disabled = false, hasApiKey, onClear, onSave }: ApiKeySettingsProps) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError(null);
      await handleClear();
      return;
    }
    setIsSaving(true);
    try {
      const isValid = await isValidApiKeyFormat(trimmed);
      if (!isValid) {
        setError('Invalid API key format. It should start with "sk-ant-".');
        setIsSaving(false);
        return;
      }
      await onSave(trimmed);
      setDraft('');
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not save API key.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    setIsSaving(true);
    try {
      await onClear();
      setDraft('');
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not clear API key.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="sfield">
      <div className="sfield-info">
        <div className="sfield-label">Anthropic API Key</div>
        <div className="sfield-desc">
          {hasApiKey
            ? 'Key is stored securely in the OS credential store. You can clear it at any time.'
            : 'Enter your API key to enable Claude Vision analysis.'}
        </div>
      </div>
      <div className="sfield-control">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            autoComplete="off"
            className={`s-input ${error ? 'input-error' : ''}`}
            onChange={(event) => { setDraft(event.currentTarget.value); setError(null); }}
            placeholder="sk-ant-..."
            type="password"
            value={draft}
            maxLength={200}
            style={{ width: '240px' }}
            aria-label="Anthropic API key"
            disabled={disabled || isSaving}
          />
          <button 
            className="btn-primary" 
            onClick={handleSave} 
            type="button"
            style={{ width: 'auto', padding: '10px 16px' }}
            aria-label="Save API key"
            disabled={disabled || isSaving}
          >
            Save
          </button>
          <button
            className="danger-btn"
            onClick={handleClear}
            type="button"
            aria-label="Clear API key"
            disabled={disabled || isSaving}
          >
            Clear
          </button>
          {error && <div style={{ color: '#d9534f', width: '100%', fontSize: '13px', marginTop: '4px' }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
