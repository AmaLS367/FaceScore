import type { AnalysisReport, ClaudeImagePayload } from '../domain/analysis';
import { parseAnalysisResponse } from '../domain/parseAnalysisResponse';
import { invoke } from '@tauri-apps/api/core';

const ANALYZE_FACE_COMMAND = 'analyze_face';

interface AnalyzeFaceInput {
  image: ClaudeImagePayload;
  prompt?: string;
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

export async function analyzeFace({ image, prompt = buildFaceAnalysisPrompt() }: AnalyzeFaceInput): Promise<AnalysisReport> {
  let payload: AnthropicMessageResponse;

  try {
    payload = await invoke<AnthropicMessageResponse>(ANALYZE_FACE_COMMAND, { image, prompt });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(typeof error === 'string' ? error : 'Analysis failed.', { cause: error });
  }

  const toolCall = payload.content?.find((block): block is AnthropicToolUseBlock => block.type === 'tool_use' && block.name === 'generate_report');
  const textBlock = payload.content?.find((block): block is { type: 'text'; text: string } => block.type === 'text' && typeof block.text === 'string');

  return parseAnalysisResponse(toolCall?.input || textBlock?.text || payload);
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
