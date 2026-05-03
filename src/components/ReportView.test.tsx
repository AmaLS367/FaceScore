import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { fixtureReport } from '../domain/fixtureReport';
import { ReportView } from './ReportView';

describe('ReportView', () => {
  it('renders the score summary, categories, strengths, and recommendations', () => {
    render(<ReportView report={fixtureReport} imageUrl={null} onReset={vi.fn()} />);

    expect(screen.getByText(/Strong baseline/i)).toBeInTheDocument();
    
    // Check overall score specifically in its container (82 / 10 = 8.2)
    const overallScoreContainer = screen.getByText(/Overall Presentation Score/i).parentElement;
    if (overallScoreContainer) {
       expect(within(overallScoreContainer).getByText('8.2')).toBeInTheDocument();
    } else {
       expect(screen.getAllByText('8.2').length).toBeGreaterThan(0);
    }

    expect(screen.getByText('Symmetry')).toBeInTheDocument();
    
    // Multiple "Strengths" text exists, check for the specific list title
    expect(screen.getByText('Strengths', { selector: '.list-card-title' })).toBeInTheDocument();
    
    // Multiple occurrences of recommendations might exist (one in summary, one in cards)
    expect(screen.getAllByText(/Define the grooming baseline/i).length).toBeGreaterThan(0);
  });
});
