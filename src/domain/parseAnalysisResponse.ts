import { ZodError } from 'zod';

import { type AnalysisReport, analysisReportSchema } from './analysis';

export function parseAnalysisResponse(rawText: string): AnalysisReport {
  let jsonText = rawText.trim();

  // Handle Claude wrapping JSON in markdown code blocks
  const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = jsonText.match(markdownRegex);
  if (match && match[1]) {
    jsonText = match[1].trim();
  }

  // If there's still text before/after the JSON object, try to find the first '{' and last '}'
  if (!jsonText.startsWith('{')) {
    const start = jsonText.indexOf('{');
    const end = jsonText.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      jsonText = jsonText.substring(start, end + 1);
    }
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse JSON. Raw text:', rawText);
    throw new Error('Claude returned malformed JSON.', { cause: error });
  }

  try {
    return analysisReportSchema.parse(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Zod Validation Error:', error.errors);
      throw new Error('Claude response did not match the FaceScore report schema.', { cause: error });
    }

    throw error;
  }
}
