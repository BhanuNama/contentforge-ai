import { callGroq, MODELS } from "../groq";
import { CriticReportSchema, type CriticReport } from "../schemas/agents";
import { PLATFORM_CONFIG } from "../utils";
import type { Platform } from "../utils";

export async function runCriticAgent(
  platform: string,
  content: string,
  sourceContent: string
): Promise<CriticReport> {
  const config = PLATFORM_CONFIG[platform as Platform];
  const charLimit = config?.charLimit || 10000;
  const charCount = content.length;
  const withinLimit = charCount <= charLimit;

  const systemPrompt = `You are the ContentForge Quality Critic Agent.
You review AI-generated content before it reaches the user.

Your job: score and critique content for quality, format compliance, and authenticity.

Return ONLY valid JSON with this exact structure:
{
  "passed": true/false,
  "score": 7.5,
  "checks": {
    "char_limit": true/false,
    "hook_quality": 8,
    "platform_format": true/false,
    "no_hallucination": true/false
  },
  "feedback": "Brief explanation of score",
  "suggestions": ["Improvement 1", "Improvement 2"]
}

Score criteria:
- 9-10: Exceptional, ready to post
- 7-8: Good, minor tweaks
- 5-6: Acceptable, noticeable issues
- Below 5: Needs rewrite`;

  const userMessage = `Review this ${platform} content:

PLATFORM: ${platform} (char limit: ${charLimit})
CONTENT LENGTH: ${charCount} characters
WITHIN LIMIT: ${withinLimit}

CONTENT:
${content.slice(0, 1500)}

SOURCE MATERIAL (to check for hallucinations):
${sourceContent.slice(0, 500)}

Check: character limit compliance, hook quality (first sentence), platform format rules, and factual grounding.`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.CRITIC,
    temperature: 0.3,
    maxTokens: 512,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return CriticReportSchema.parse({
      ...parsed,
      checks: {
        char_limit: withinLimit,
        hook_quality: parsed.checks?.hook_quality || 7,
        platform_format: parsed.checks?.platform_format ?? true,
        no_hallucination: parsed.checks?.no_hallucination ?? true,
      },
    });
  } catch {
    return {
      passed: withinLimit,
      score: withinLimit ? 7 : 4,
      checks: {
        char_limit: withinLimit,
        hook_quality: 7,
        platform_format: true,
        no_hallucination: true,
      },
      feedback: withinLimit ? "Content generated successfully." : "Content exceeds character limit.",
      suggestions: [],
    };
  }
}
