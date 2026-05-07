import type { AnalysisReport, ClaudeImagePayload } from '../domain/analysis';
import { parseAnalysisResponse } from '../domain/parseAnalysisResponse';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-sonnet-4-6';

interface AnalyzeFaceInput {
  apiKey: string;
  image: ClaudeImagePayload;
  prompt?: string;
  signal?: AbortSignal;
}

interface AnthropicToolUseBlock {
  type: 'tool_use';
  id: string;
  name: string;
  input: unknown;
}

interface AnthropicMessageResponse {
  content?: Array<{ type: string; [key: string]: unknown } | AnthropicToolUseBlock>;
}

interface AnthropicErrorResponse {
  error?: {
    message?: string;
  };
}

export async function analyzeFace({ apiKey, image, prompt = buildFaceAnalysisPrompt(), signal }: AnalyzeFaceInput): Promise<AnalysisReport> {
  let response;
  try {
    response = await tauriFetch(ANTHROPIC_MESSAGES_URL, {
      method: 'POST',
      headers: {
        'anthropic-dangerous-direct-browser-access': 'true',
        'anthropic-version': ANTHROPIC_VERSION,
        'content-type': 'application/json',
        'x-api-key': apiKey.trim(),
      },
      signal,
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        tools: [
          {
            name: "generate_report",
            description: "Output the facial analysis report in a structured format.",
            input_schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                overallScore: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    value: { type: "number" },
                    label: { type: "string" },
                    summary: { type: "string" }
                  },
                  required: ["value", "label", "summary"]
                },
                scoreCategories: {
                  type: "array",
                  minItems: 5,
                  maxItems: 5,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      id: { type: "string", enum: ["symmetry", "proportions", "skin", "grooming", "style"] },
                      label: { type: "string" },
                      value: { type: "number" },
                      summary: { type: "string" },
                      details: { type: "array", items: { type: "string" } }
                    },
                    required: ["id", "label", "value", "summary", "details"]
                  }
                },
                strengths: { type: "array", minItems: 1, maxItems: 10, items: { type: "string" } },
                recommendations: {
                  type: "array",
                  minItems: 1,
                  maxItems: 10,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      title: { type: "string" },
                      priority: { type: "string", enum: ["high", "medium", "low"] },
                      detail: { type: "string" }
                    },
                    required: ["title", "priority", "detail"]
                  }
                },
                groomingNotes: { type: "array", minItems: 1, maxItems: 10, items: { type: "string" } },
                styleNotes: { type: "array", minItems: 1, maxItems: 10, items: { type: "string" } }
              },
              required: ["overallScore", "scoreCategories", "strengths", "recommendations", "groomingNotes", "styleNotes"]
            }
          }
        ],
        tool_choice: { type: "tool", name: "generate_report" },
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
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.', { cause: error });
  }

  if (!response.ok) {
    const serviceMessage = await readServiceErrorMessage(response);
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        serviceMessage
          ? `Authentication failed: ${serviceMessage}`
          : 'Authentication failed. Please check your Anthropic API key.',
      );
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded or insufficient quota. Please try again later.');
    }
    throw new Error(`Analysis service rejected the request (${response.status}). Please try again later.`);
  }

  let payload: AnthropicMessageResponse;
  try {
    payload = await response.json() as AnthropicMessageResponse;
  } catch (error) {
    throw new Error('Analysis service returned an invalid response format.', { cause: error });
  }

  const toolCall = payload.content?.find((block): block is AnthropicToolUseBlock => block.type === 'tool_use' && block.name === 'generate_report');

  if (!toolCall || !toolCall.input) {
    throw new Error('Analysis service response was empty or incorrectly formatted.');
  }

  try {
    return parseAnalysisResponse(toolCall.input);
  } catch (error) {
    throw new Error('Failed to interpret the analysis data. The photo might be unclear.', { cause: error });
  }
}

export function buildFaceAnalysisPrompt(): string {
  return `Create a clean, minimal, high-end facial beauty report based on this photo. Use a black-on-white design with thin lines, rounded cards, and a luxury aesthetic. Include an honest attractiveness analysis (symmetry, proportions, bone structure, skin, etc.), clear scores, strengths, areas for improvement, and actionable grooming/style recommendations. Keep it data-driven, visually refined, and not overly flattering.

Return exactly five score categories using these ids only: symmetry, proportions, skin, grooming, style. Discuss bone structure inside proportions, not as a separate category.

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
  * Any skin clarity issues, texture, or inflammation MUST significantly lower the "Skin" score.`;
}

async function readServiceErrorMessage(response: Response): Promise<string | null> {
  try {
    const payload = await response.json() as AnthropicErrorResponse;
    return payload.error?.message || null;
  } catch {
    return null;
  }
}
