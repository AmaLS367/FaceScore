import { z } from 'zod';

export const scoreCategorySchema = z.object({
  id: z.enum(['symmetry', 'proportions', 'skin', 'grooming', 'style']),
  label: z.string().min(1).max(50),
  value: z.coerce.number().min(0).max(100),
  summary: z.string().min(1).max(200),
  details: z.array(z.string().min(1).max(200)).min(1).max(10),
});

export const recommendationSchema = z.object({
  title: z.string().min(1).max(100),
  priority: z.enum(['high', 'medium', 'low']),
  detail: z.string().min(1).max(300),
});

export const analysisReportSchema = z.object({
  overallScore: z.object({
    value: z.coerce.number().min(0).max(100),
    label: z.string().min(1).max(50),
    summary: z.string().min(1).max(500),
  }),
  scoreCategories: z.array(scoreCategorySchema).length(5),
  strengths: z.array(z.string().min(1).max(150)).min(1).max(10),
  recommendations: z.array(recommendationSchema).min(1).max(10),
  groomingNotes: z.array(z.string().min(1).max(200)).min(1).max(10),
  styleNotes: z.array(z.string().min(1).max(200)).min(1).max(10),
});

export type ScoreCategory = z.infer<typeof scoreCategorySchema>;
export type AnalysisReport = z.infer<typeof analysisReportSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;

export interface ClaudeImagePayload {
  media_type: 'image/jpeg' | 'image/png' | 'image/webp';
  data: string;
}
