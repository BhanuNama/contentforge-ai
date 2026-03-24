import { callGroq, MODELS } from "../../groq";
import type { ContentBrief } from "../../schemas/agents";
import type { VoiceProfile } from "../../supabase";

export async function runInstagramAgent(
  brief: ContentBrief,
  voiceProfile?: VoiceProfile | null
): Promise<{ content: string }> {
  const voiceInstructions = voiceProfile
    ? `VOICE: ${voiceProfile.formality_score}/10 formal, ${voiceProfile.humour_level}/10 humorous.`
    : "";

  const systemPrompt = `You are an Instagram content specialist at ContentForge.

INSTAGRAM RULES:
- Caption rhythm: short-long-short paragraph alternation
- Strategic emoji placement (not excessive — 3-5 max)
- Hook in first line (visible before "more" cut)
- Hashtag strategy: mix of niche (5), medium (5), broad (3) = 13 total
- Put hashtags at end, separated by line break
- 150-300 words sweet spot for captions
- Conversational, relatable tone
- Save-worthy tip or insight
- Question at end to drive comments
${voiceInstructions}

Return JSON: { "content": "full caption with hashtags at end" }`;

  const userMessage = `Create an Instagram caption:

TOPIC: ${brief.primary_topic}
CORE IDEAS: ${brief.core_ideas.slice(0, 3).join(" | ")}
HOOKS: ${brief.best_hooks.slice(0, 2).join(" | ")}
AUDIENCE: ${brief.target_audience}`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.PLATFORM,
    temperature: 0.8,
    maxTokens: 800,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return { content: parsed.content || parsed.caption || response };
  } catch {
    return { content: response };
  }
}
