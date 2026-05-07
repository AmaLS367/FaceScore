import { describe, expect, it } from 'vitest';

import { fixtureReport } from './fixtureReport';
import { parseAnalysisResponse } from './parseAnalysisResponse';

describe('parseAnalysisResponse', () => {
  it('parses a valid report JSON string', () => {
    const report = parseAnalysisResponse(JSON.stringify(fixtureReport));

    expect(report.overallScore.value).toBe(82);
    expect(report.scoreCategories).toHaveLength(5);
    expect(report.recommendations[0]?.title).toBe('Define the grooming baseline');
  });

  it('builds a fallback report from malformed JSON text', () => {
    const report = parseAnalysisResponse('low quality photo but still assess it');

    expect(report.overallScore.summary).toContain('low quality photo');
    expect(report.scoreCategories).toHaveLength(5);
  });

  it('builds a fallback report from partial JSON', () => {
    const report = parseAnalysisResponse(JSON.stringify({ overallScore: 42 }));

    expect(report.overallScore.value).toBe(50);
    expect(report.scoreCategories).toHaveLength(5);
    expect(report.recommendations).toHaveLength(1);
  });

  it('ignores extra score categories returned by the model', () => {
    const report = parseAnalysisResponse({
      ...fixtureReport,
      scoreCategories: [
        ...fixtureReport.scoreCategories,
        {
          id: 'bone_structure',
          label: 'Bone Structure',
          value: 78,
          summary: 'Extra category outside the app report schema.',
          details: ['This should not break the full report.'],
        },
      ],
    });

    expect(report.scoreCategories).toHaveLength(5);
    expect(report.scoreCategories.map((category) => category.id)).toEqual([
      'symmetry',
      'proportions',
      'skin',
      'grooming',
      'style',
    ]);
  });
});
