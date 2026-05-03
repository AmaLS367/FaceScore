import { useState } from 'react';

interface ApiKeySettingsProps {
  apiKey: string;
  onChange: (apiKey: string) => void;
}

export function ApiKeySettings({ apiKey, onChange }: ApiKeySettingsProps) {
  const [draft, setDraft] = useState(apiKey);

  return (
    <div className="sfield">
      <div className="sfield-info">
        <div className="sfield-label">Anthropic API Key</div>
        <div className="sfield-desc">
          {apiKey 
            ? 'Key is saved locally. You can clear it at any time.' 
            : 'Enter your API key to enable Claude Vision analysis.'}
        </div>
      </div>
      <div className="sfield-control">
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            autoComplete="off"
            className="s-input"
            onChange={(event) => setDraft(event.currentTarget.value)}
            placeholder="sk-ant-..."
            type="password"
            value={draft}
            style={{ width: '240px' }}
            aria-label="Anthropic API key"
          />
          <button 
            className="btn-primary" 
            onClick={() => onChange(draft.trim())} 
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
              onChange('');
            }}
            type="button"
            aria-label="Clear API key"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
