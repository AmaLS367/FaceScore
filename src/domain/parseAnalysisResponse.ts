import { ZodError } from 'zod';
import { type AnalysisReport, analysisReportSchema } from './analysis';

export function parseAnalysisResponse(input: unknown): AnalysisReport {
  let data = input;
  
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      throw new Error('Response is a string but not valid JSON');
    }
  }

  try {
    return analysisReportSchema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Analysis response missing required fields or has invalid data format.');
    }
    throw error;
  }
}
