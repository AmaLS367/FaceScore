import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders the FaceScore shell with a fixture report', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'FaceScore' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Strong baseline/i })).toBeInTheDocument();
  });
});
