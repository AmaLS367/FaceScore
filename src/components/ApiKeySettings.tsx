import { useState } from 'react';
import { isValidApiKeyFormat } from '../lib/apiKeyStore';

interface ApiKeySettingsProps {
  apiKey: string;
  onChange: (apiKey: string) => void;
}

export function ApiKeySettings({ apiKey, onChange }: ApiKeySettingsProps) {
  const [draft, setDraft] = useState(apiKey);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError(null);
      onChange('');
      return;
    }
    if (!isValidApiKeyFormat(trimmed)) {
      setError('Invalid API key format. It should start with "sk-".');
      return;
    }
    setError(null);
    onChange(trimmed);
  };

  return (
    <div className="sfield">
      <div className="sfield-info">
        <div className="sfield-label">Anthropic API Key</div>
        <div className="sfield-desc">
          {apiKey 
            ? 'Key is stored in memory for this session only. You can clear it at any time.' 
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
          />
          <button 
            className="btn-primary" 
            onClick={handleSave} 
            type="button"
            style={{ width: 'auto', padding: '10px 16px' }}
            aria-label="Save API key"
          >
            Save
          </button>
          <button
            className="danger-btn"
            onClick={() => {
              setDraft('');
              setError(null);
              onChange('');
            }}
            type="button"
            aria-label="Clear API key"
          >
            Clear
          </button>
          {error && <div style={{ color: '#d9534f', width: '100%', fontSize: '13px', marginTop: '4px' }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
