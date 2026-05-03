import type { AnalysisReport, ClaudeImagePayload } from '../domain/analysis';
import { parseAnalysisResponse } from '../domain/parseAnalysisResponse';

const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-sonnet-4-6';

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
      max_tokens: 4096,
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
  return `Create a clean, minimal, high-end facial beauty report based on this photo. Use a black-on-white design with thin lines, rounded cards, and a luxury aesthetic. Include a simple contour line drawing of the face (as a single-line string using \\n for newlines), an honest attractiveness analysis (symmetry, proportions, bone structure, skin, etc.), clear scores, strengths, areas for improvement, and actionable grooming/style recommendations. Keep it data-driven, visually refined, and not overly flattering.

SCORING RULES (CRITICAL):
- Before scoring, assess the photo context:
  * Lighting: is it harsh, flat, studio, natural? Adjust skin and texture scores accordingly.
  * Angle: slight downward or upward angles distort proportions — account for this, do not penalize.
  * Resolution and compression: low quality or grainy photos hide actual skin texture — do not over-penalize.
  * Camera distance and lens: close-up wide-angle lenses exaggerate nose and jaw — factor in.
- Do not default to 7.0/10. 7.0/10 is "Above Average" and must be earned.
- Use one decimal place for all scores (e.g., 52.4, 78.1, 44.9).
- Mandatory Deductions:
  * Facial fat or lack of bone definition MUST significantly lower the "Proportions" score.
  * Any skin clarity issues, texture, or inflammation MUST significantly lower the "Skin" score.

CRITICAL: Your entire response must be a single valid JSON object. No text before it. No text after it. No markdown. No explanation. Start your response with { and end with }
Return ONLY valid JSON. Ensure all strings are properly escaped. No unescaped newlines in JSON strings.
{
  "overallScore": { "value": 0.0-100.0, "label": "string", "summary": "string" },
  "scoreCategories": [
    { "id": "symmetry", "label": "Symmetry", "value": 0.0-100.0, "summary": "string", "details": ["string"] },
    { "id": "proportions", "label": "Proportions", "value": 0.0-100.0, "summary": "string", "details": ["string"] },
    { "id": "skin", "label": "Skin", "value": 0.0-100.0, "summary": "string", "details": ["string"] },
    { "id": "grooming", "label": "Grooming", "value": 0.0-100.0, "summary": "string", "details": ["string"] },
    { "id": "style", "label": "Style", "value": 0.0-100.0, "summary": "string", "details": ["string"] }
  ],
  "strengths": ["string"],
  "recommendations": [{ "title": "string", "priority": "high|medium|low", "detail": "string" }],
  "groomingNotes": ["string"],
  "styleNotes": ["string"]
}`;
}
