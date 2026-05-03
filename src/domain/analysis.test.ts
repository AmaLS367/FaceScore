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
});
