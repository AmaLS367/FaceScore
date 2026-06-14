import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ApiKeySettings } from './ApiKeySettings';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(async (command, args?: unknown) => {
    if (command === 'validate_api_key_format') {
      const keyObj = args as { key?: string } | undefined;
      return keyObj?.key?.startsWith('sk-ant-') ?? false;
    }
    return undefined;
  }),
}));

describe('ApiKeySettings', () => {
  it('saves edited API keys', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onClear = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ApiKeySettings hasApiKey={false} onClear={onClear} onSave={onSave} />);

    await user.type(screen.getByLabelText(/Anthropic API key/i), 'sk-ant-testkey-1234567890');
    await user.click(screen.getByRole('button', { name: /Save API key/i }));

    expect(onSave).toHaveBeenCalledWith('sk-ant-testkey-1234567890');
    expect(screen.getByLabelText(/Anthropic API key/i)).toHaveValue('');
  });

  it('clears API keys', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onClear = vi.fn().mockResolvedValue(undefined);
    render(<ApiKeySettings hasApiKey={true} onClear={onClear} onSave={onSave} />);

    await userEvent.click(screen.getByRole('button', { name: /Clear API key/i }));

    expect(onClear).toHaveBeenCalled();
  });

  it('shows secure storage copy when a key exists', () => {
    render(
      <ApiKeySettings
        hasApiKey={true}
        onClear={vi.fn().mockResolvedValue(undefined)}
        onSave={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    expect(screen.getByText(/OS credential store/i)).toBeInTheDocument();
  });
});
