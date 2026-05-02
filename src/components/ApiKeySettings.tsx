import { useState } from 'react';

interface ApiKeySettingsProps {
  apiKey: string;
  onChange: (apiKey: string) => void;
}

export function ApiKeySettings({ apiKey, onChange }: ApiKeySettingsProps) {
  const [draft, setDraft] = useState(apiKey);

  return (
    <section className="api-key-settings">
      <h2>Claude API</h2>
      <label>
        Anthropic API key
        <input
          autoComplete="off"
          onChange={(event) => setDraft(event.currentTarget.value)}
          placeholder="sk-ant-..."
          type="password"
          value={draft}
        />
      </label>
      <div className="button-row">
        <button onClick={() => onChange(draft.trim())} type="button">
          Save API key
        </button>
        <button
          className="secondary-button"
          onClick={() => {
            setDraft('');
            onChange('');
          }}
          type="button"
        >
          Clear API key
        </button>
      </div>
      <p>{apiKey ? 'Key saved locally on this device.' : 'Paste your own key before running analysis.'}</p>
    </section>
  );
}
