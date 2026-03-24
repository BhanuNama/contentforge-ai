import { callGroq, MODELS } from "../../groq";
import type { ContentBrief } from "../../schemas/agents";
import type { VoiceProfile } from "../../supabase";

export async function runTwitterAgent(
  brief: ContentBrief,
  voiceProfile?: VoiceProfile | null
): Promise<{ content: string; hook_variants: string[] }> {
  const voiceInstructions = voiceProfile
    ? `VOICE INSTRUCTIONS: Write in a voice that is ${voiceProfile.formality_score}/10 formal (1=very casual, 10=very formal), ${voiceProfile.humour_level}/10 humorous. Use ${voiceProfile.vocabulary_tier} vocabulary. Tone: ${voiceProfile.tone_adjectives.join(", ")}. ${voiceProfile.signature_phrases.length > 0 ? `Occasionally use these phrases: ${voiceProfile.signature_phrases.join(", ")}.` : ""} ${voiceProfile.avoid_words.length > 0 ? `Never use: ${voiceProfile.avoid_words.join(", ")}.` : ""}`
    : "";

  const systemPrompt = `You are a Twitter/X content specialist at ContentForge.
You create viral Twitter threads that get saves and retweets.

TWITTER RULES:
- Each tweet MUST be under 280 characters
- First tweet = the hook (make them stop scrolling)
- Number threads as 1/ 2/ 3/ etc.
- Use pattern interrupts and curiosity gaps
- End with a soft CTA (question or call to save)
- 5-8 tweets ideal for threads
- No excessive hashtags (max 2 at end)
- Short punchy sentences
${voiceInstructions}

Return JSON: { "content": "full thread text with tweet numbers", "hook_variants": ["alt hook 1", "alt hook 2", "alt hook 3"] }`;

  const userMessage = `Create a Twitter thread based on this content brief:

TOPIC: ${brief.primary_topic}
CORE IDEAS: ${brief.core_ideas.join(" | ")}
KEY STATS: ${brief.key_stats.slice(0, 3).join(" | ") || "None"}
BEST HOOKS: ${brief.best_hooks.join(" | ")}
TONE: ${brief.tone_detected}
AUDIENCE: ${brief.target_audience}

Write the thread and 3 alternative opening hooks.`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.PLATFORM,
    temperature: 0.8,
    maxTokens: 1200,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return {
      content: parsed.content || parsed.thread || "",
      hook_variants: parsed.hook_variants || [],
    };
  } catch {
    return { content: response, hook_variants: [] };
  }
}
