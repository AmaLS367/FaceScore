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

  it('rejects malformed JSON', () => {
    expect(() => parseAnalysisResponse('{bad json')).toThrow('Response is a string but not valid JSON');
  });

  it('rejects JSON that does not match the report schema', () => {
    expect(() => parseAnalysisResponse(JSON.stringify({ overallScore: 100 }))).toThrow(
      'Analysis response missing required fields or has invalid data format.',
    );
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
