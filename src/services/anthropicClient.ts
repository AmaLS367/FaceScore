import type { AnalysisReport, ClaudeImagePayload } from '../domain/analysis';
import { parseAnalysisResponse } from '../domain/parseAnalysisResponse';

const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-sonnet-4-20250514';

interface AnalyzeFaceInput {
  apiKey: string;
  image: ClaudeImagePayload;
  prompt?: string;
}

interface AnthropicTextBlock {
  type: 'text';
  text: string;
}

interface AnthropicMessageResponse {
  content?: Array<AnthropicTextBlock | { type: string }>;
}

export async function analyzeFace({ apiKey, image, prompt = buildFaceAnalysisPrompt() }: AnalyzeFaceInput): Promise<AnalysisReport> {
  const response = await fetch(ANTHROPIC_MESSAGES_URL, {
    method: 'POST',
    headers: {
      'anthropic-dangerous-direct-browser-access': 'true',
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2400,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: image.media_type,
                data: image.data,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as AnthropicMessageResponse;
  const textBlock = payload.content?.find((block): block is AnthropicTextBlock => block.type === 'text');

  if (!textBlock) {
    throw new Error('Claude response did not include a text report.');
  }

  return parseAnalysisResponse(textBlock.text);
}

export function buildFaceAnalysisPrompt(): string {
  return `Analyze this face photo for grooming, presentation, symmetry, proportions, skin presentation, and style.

Return only valid JSON. Do not wrap it in markdown. The JSON must match this exact shape:
{
  "overallScore": { "value": 0-100, "label": "short label", "summary": "2 sentence summary" },
  "scoreCategories": [
    { "id": "symmetry", "label": "Symmetry", "value": 0-100, "summary": "short summary", "details": ["specific detail"] },
    { "id": "proportions", "label": "Proportions", "value": 0-100, "summary": "short summary", "details": ["specific detail"] },
    { "id": "skin", "label": "Skin", "value": 0-100, "summary": "short summary", "details": ["specific detail"] },
    { "id": "grooming", "label": "Grooming", "value": 0-100, "summary": "short summary", "details": ["specific detail"] },
    { "id": "style", "label": "Style", "value": 0-100, "summary": "short summary", "details": ["specific detail"] }
  ],
  "strengths": ["specific strength"],
  "recommendations": [{ "title": "action title", "priority": "high|medium|low", "detail": "specific advice" }],
  "groomingNotes": ["specific grooming note"],
  "styleNotes": ["specific style note"]
}

Be direct and practical. Do not infer identity, ethnicity, age, health status, or attractiveness as a moral judgment.`;
}
