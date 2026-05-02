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
    expect(() => parseAnalysisResponse('{bad json')).toThrow('Claude returned malformed JSON.');
  });

  it('rejects JSON that does not match the report schema', () => {
    expect(() => parseAnalysisResponse(JSON.stringify({ overallScore: 100 }))).toThrow(
      'Claude response did not match the FaceScore report schema.',
    );
  });
});
