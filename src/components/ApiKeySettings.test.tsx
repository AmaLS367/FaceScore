import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ApiKeySettings } from './ApiKeySettings';

describe('ApiKeySettings', () => {
  it('saves edited API keys', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ApiKeySettings apiKey="" onChange={onChange} />);

    await user.type(screen.getByLabelText(/Anthropic API key/i), 'sk-ant-test');
    await user.click(screen.getByRole('button', { name: /Save API key/i }));

    expect(onChange).toHaveBeenCalledWith('sk-ant-test');
  });

  it('clears API keys', async () => {
    const onChange = vi.fn();
    render(<ApiKeySettings apiKey="sk-ant-test" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: /Clear API key/i }));

    expect(onChange).toHaveBeenCalledWith('');
  });
});
