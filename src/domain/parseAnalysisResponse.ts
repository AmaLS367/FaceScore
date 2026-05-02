import { ZodError } from 'zod';

import { type AnalysisReport, analysisReportSchema } from './analysis';

export function parseAnalysisResponse(rawText: string): AnalysisReport {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new Error('Claude returned malformed JSON.', { cause: error });
  }

  try {
    return analysisReportSchema.parse(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Claude response did not match the FaceScore report schema.', { cause: error });
    }

    throw error;
  }
}
