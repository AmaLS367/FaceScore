import { z } from 'zod';

export const scoreCategorySchema = z.object({
  id: z.enum(['symmetry', 'proportions', 'skin', 'grooming', 'style']),
  label: z.string().min(1),
  value: z.coerce.number().min(0).max(100),
  summary: z.string().min(1),
  details: z.array(z.string().min(1)).min(1),
});

export const recommendationSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(['high', 'medium', 'low']),
  detail: z.string().min(1),
});

export const analysisReportSchema = z.object({
  overallScore: z.object({
    value: z.coerce.number().min(0).max(100),
    label: z.string().min(1),
    summary: z.string().min(1),
  }),
  scoreCategories: z.array(scoreCategorySchema).length(5),
  strengths: z.array(z.string().min(1)).min(1),
  recommendations: z.array(recommendationSchema).min(1),
  groomingNotes: z.array(z.string().min(1)).min(1),
  styleNotes: z.array(z.string().min(1)).min(1),
});

export type ScoreCategory = z.infer<typeof scoreCategorySchema>;
export type AnalysisReport = z.infer<typeof analysisReportSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;

export interface ClaudeImagePayload {
  media_type: 'image/jpeg' | 'image/png' | 'image/webp';
  data: string;
}
