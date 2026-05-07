import { ZodError } from 'zod';
import { type AnalysisReport, analysisReportSchema } from './analysis';

const categoryDefaults = [
  { id: 'symmetry', label: 'Symmetry' },
  { id: 'proportions', label: 'Proportions' },
  { id: 'skin', label: 'Skin' },
  { id: 'grooming', label: 'Grooming' },
  { id: 'style', label: 'Style' },
] as const;
const allowedCategoryIds: Set<string> = new Set(categoryDefaults.map((category) => category.id));

export function parseAnalysisResponse(input: unknown): AnalysisReport {
  let data = input;
  
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      data = { overallScore: { summary: data } };
    }
  }

  try {
    return analysisReportSchema.parse(normalizeAnalysisResponse(data));
  } catch (error) {
    if (error instanceof ZodError) {
      return buildFallbackReport(data);
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

    report.scoreCategories = categoryDefaults
      .map(({ id }) => categoriesById.get(id))
      .filter((category): category is unknown => category !== undefined);
  }

  return report;
}

function buildFallbackReport(data: unknown): AnalysisReport {
  const source = toRecord(data);
  const overall = toRecord(source.overallScore);
  const categories = Array.isArray(source.scoreCategories) ? source.scoreCategories : [];
  const categoryById = new Map<string, Record<string, unknown>>();

  for (const category of categories) {
    const record = toRecord(category);
    const id = getString(record.id);
    if (id && allowedCategoryIds.has(id) && !categoryById.has(id)) {
      categoryById.set(id, record);
    }
  }

  const fallback: AnalysisReport = {
    overallScore: {
      value: clampScore(getNumber(overall.value, averageCategoryScore(categoryById))),
      label: shortText(getString(overall.label), 'Photo-based estimate', 50),
      summary: shortText(
        getString(overall.summary) || getString(source.summary) || getString(source.text),
        'Claude returned a partial response, so this report preserves the available assessment and uses conservative defaults for missing fields.',
        500,
      ),
    },
    scoreCategories: categoryDefaults.map(({ id, label }) => {
      const category = categoryById.get(id) || {};
      return {
        id,
        label: shortText(getString(category.label), label, 50),
        value: clampScore(getNumber(category.value, 50)),
        summary: shortText(getString(category.summary), `${label} was assessed from the available photo data.`, 200),
        details: normalizeStringArray(category.details, [`${label} details were limited in the model response.`], 10, 200),
      };
    }),
    strengths: normalizeStringArray(source.strengths, ['The photo contains enough visual information for a conservative appearance assessment.'], 10, 150),
    recommendations: normalizeRecommendations(source.recommendations),
    groomingNotes: normalizeStringArray(source.groomingNotes, ['Use clearer lighting for a more precise grooming read.'], 10, 200),
    styleNotes: normalizeStringArray(source.styleNotes, ['Use a front-facing portrait with simple styling for a more precise read.'], 10, 200),
  };

  return analysisReportSchema.parse(fallback);
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function getString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function getNumber(value: unknown, fallback: number): number {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function shortText(value: string | null, fallback: string, maxLength: number): string {
  const text = value || fallback;
  return text.length > maxLength ? text.slice(0, maxLength - 1).trimEnd() : text;
}

function normalizeStringArray(value: unknown, fallback: string[], maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => getString(item))
    .filter((item): item is string => Boolean(item))
    .map((item) => shortText(item, '', maxLength))
    .slice(0, maxItems);

  return items.length > 0 ? items : fallback;
}

function normalizeRecommendations(value: unknown): AnalysisReport['recommendations'] {
  if (!Array.isArray(value)) {
    return [
      {
        title: 'Improve photo conditions',
        priority: 'high',
        detail: 'Use front-facing light and a sharper portrait for a more detailed score breakdown.',
      },
    ];
  }

  const recommendations = value
    .map((item) => {
      const record = toRecord(item);
      const priority = normalizePriority(getString(record.priority));
      return {
        title: shortText(getString(record.title), 'Improve presentation quality', 100),
        priority,
        detail: shortText(getString(record.detail), 'Use a clearer portrait to improve the precision of this recommendation.', 300),
      };
    })
    .slice(0, 10);

  return recommendations.length > 0 ? recommendations : normalizeRecommendations(null);
}

function normalizePriority(value: string | null): AnalysisReport['recommendations'][number]['priority'] {
  return value === 'high' || value === 'medium' || value === 'low' ? value : 'medium';
}

function averageCategoryScore(categories: Map<string, Record<string, unknown>>): number {
  const scores = [...categories.values()]
    .map((category) => getNumber(category.value, Number.NaN))
    .filter(Number.isFinite);

  if (scores.length === 0) {
    return 50;
  }

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}
