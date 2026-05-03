import { ZodError } from 'zod';
import { type AnalysisReport, analysisReportSchema } from './analysis';

export function parseAnalysisResponse(rawText: string): AnalysisReport {
  let jsonText = rawText.trim();

  // 1. Extract JSON from markdown if present
  const markdownRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = jsonText.match(markdownRegex);
  if (match && match[1]) {
    jsonText = match[1].trim();
  }

  // 2. Find the outermost curly braces
  const start = jsonText.indexOf('{');
  const end = jsonText.lastIndexOf('}');
  
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in Claude response.');
  }

  jsonText = jsonText.substring(start, end + 1);

  // 3. Fix raw newlines inside JSON strings (common with ASCII art)
  // This looks for content between quotes and replaces actual newlines with \n
  jsonText = jsonText.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match) => {
    return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
  });

  // 4. Clean control characters
  // eslint-disable-next-line no-control-regex
  jsonText = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => {
    if (c === '\n' || c === '\r' || c === '\t') return c;
    return '';
  });

  // 5. Smart quotes
  jsonText = jsonText.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (error) {
    // Final attempt: remove trailing commas
    try {
      const cleaned = jsonText.replace(/,\s*([\]}])/g, '$1');
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('Final JSON parse failed. Cleaned text:', jsonText);
      throw new Error('Claude returned malformed JSON even after aggressive cleaning.', { cause: error });
    }
  }

  try {
    return analysisReportSchema.parse(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Schema validation failed:', error.errors);
      throw new Error('Claude response missing required fields or has invalid data format.', { cause: error });
    }
    throw error;
  }
}
