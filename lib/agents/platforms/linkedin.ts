import { callGroq, MODELS } from "../../groq";
import type { ContentBrief } from "../../schemas/agents";
import type { VoiceProfile } from "../../supabase";

export async function runLinkedInAgent(
  brief: ContentBrief,
  voiceProfile?: VoiceProfile | null
): Promise<{ content: string; hook_variants: string[] }> {
  const voiceInstructions = voiceProfile
    ? `VOICE: ${voiceProfile.formality_score}/10 formal, ${voiceProfile.tone_adjectives.join(", ")}. Phrases to weave in: ${voiceProfile.signature_phrases.slice(0, 2).join(", ")}.`
    : "";

  const systemPrompt = `You are a LinkedIn content specialist at ContentForge.
You write posts that get saved, shared, and drive profile visits.

LINKEDIN RULES (non-negotiable):
- 3-line hook BEFORE "see more" cutoff — make line 3 a cliff-hanger
- NO hashtags in the body (put 3-5 at very end only)
- Personal story or bold claim opener
- Short paragraphs (2-3 lines max)
- One clear insight per paragraph
- End with a reflective question to drive comments
- Total: 800-1500 characters sweet spot
- White space is your friend — break it up
- B2B framing if the topic allows it
${voiceInstructions}

Return JSON: { "content": "full post text", "hook_variants": ["alt hook 1", "alt hook 2", "alt hook 3"] }`;

  const userMessage = `Create a LinkedIn post based on this content brief:

TOPIC: ${brief.primary_topic}
CORE IDEAS: ${brief.core_ideas.join(" | ")}
KEY STATS: ${brief.key_stats.slice(0, 3).join(" | ") || "None"}
BEST HOOKS: ${brief.best_hooks.join(" | ")}
AUDIENCE: ${brief.target_audience}

Write the post and 3 alternative opening hooks.`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.PLATFORM,
    temperature: 0.75,
    maxTokens: 1000,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return {
      content: parsed.content || parsed.post || "",
      hook_variants: parsed.hook_variants || [],
    };
  } catch {
    return { content: response, hook_variants: [] };
  }
}
