import { callGroq, MODELS } from "../../groq";
import type { ContentBrief } from "../../schemas/agents";
import type { VoiceProfile } from "../../supabase";

export async function runTikTokAgent(
  brief: ContentBrief,
  voiceProfile?: VoiceProfile | null
): Promise<{ content: string }> {
  const voiceInstructions = voiceProfile
    ? `VOICE: ${voiceProfile.humour_level}/10 humorous, ${voiceProfile.formality_score}/10 formal.`
    : "";

  const systemPrompt = `You are a TikTok/short video script specialist at ContentForge.

TIKTOK SCRIPT RULES:
- HOOK IN FIRST 3 SECONDS (written out — this is critical)
- Pattern interrupt (challenge assumption, surprise, controversy)
- Conversational spoken language (not written language)
- Verbal CTA for saves: "Save this for later"
- 60-90 second script ideal
- Include [ACTION] and [VISUAL] cues in brackets
- Trending audio suggestion at end
- End with retention hook for next video
${voiceInstructions}

FORMAT:
[0-3s HOOK]: ...
[3-10s SETUP]: ...
[10-45s VALUE]: ...
[45-55s PATTERN INTERRUPT]: ...
[55-60s CTA]: ...

AUDIO SUGGESTION: [trending audio type or song style]
CAPTION (for description): [short punchy caption with 3-5 hashtags]

Return JSON: { "content": "full formatted script" }`;

  const userMessage = `Create a TikTok script:

TOPIC: ${brief.primary_topic}
CORE IDEAS: ${brief.core_ideas.slice(0, 3).join(" | ")}
BEST HOOK: ${brief.best_hooks[0]}
AUDIENCE: ${brief.target_audience}`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.PLATFORM,
    temperature: 0.85,
    maxTokens: 900,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return { content: parsed.content || parsed.script || response };
  } catch {
    return { content: response };
  }
}
