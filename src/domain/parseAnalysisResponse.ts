import { ZodError } from 'zod';
import { type AnalysisReport, analysisReportSchema } from './analysis';

const allowedCategoryIds = new Set(['symmetry', 'proportions', 'skin', 'grooming', 'style']);

export function parseAnalysisResponse(input: unknown): AnalysisReport {
  let data = input;
  
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (error) {
      throw new Error('Response is a string but not valid JSON', { cause: error });
    }
  }

  try {
    return analysisReportSchema.parse(normalizeAnalysisResponse(data));
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Analysis response missing required fields or has invalid data format.', { cause: error });
    }
    throw error;
  }
}

function normalizeAnalysisResponse(data: unknown): unknown {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return data;
  }

  const report = { ...(data as Record<string, unknown>) };

  if (Array.isArray(report.scoreCategories)) {
    const categoriesById = new Map<string, unknown>();

    for (const category of report.scoreCategories) {
      if (!category || typeof category !== 'object' || Array.isArray(category)) {
        continue;
      }

      const id = (category as Record<string, unknown>).id;
      if (typeof id === 'string' && allowedCategoryIds.has(id) && !categoriesById.has(id)) {
        categoriesById.set(id, category);
      }
    }

    report.scoreCategories = [...allowedCategoryIds]
      .map((id) => categoriesById.get(id))
      .filter((category): category is unknown => category !== undefined);
  }

  return report;
}
