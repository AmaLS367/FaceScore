import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { fixtureReport } from '../domain/fixtureReport';
import { ReportView } from './ReportView';

describe('ReportView', () => {
  it('renders the score summary, categories, strengths, and recommendations', () => {
    render(<ReportView report={fixtureReport} />);

    expect(screen.getByRole('heading', { name: /Strong baseline/i })).toBeInTheDocument();
    expect(screen.getByText('82')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Symmetry' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Strengths/i })).toBeInTheDocument();
    expect(screen.getByText('Define the grooming baseline')).toBeInTheDocument();
  });
});
