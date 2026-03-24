import { callGroq, MODELS } from "../../groq";
import type { ContentBrief } from "../../schemas/agents";
import type { VoiceProfile } from "../../supabase";

export async function runNewsletterAgent(
  brief: ContentBrief,
  voiceProfile?: VoiceProfile | null
): Promise<{ content: string }> {
  const voiceInstructions = voiceProfile
    ? `VOICE: ${voiceProfile.formality_score}/10 formal, ${voiceProfile.humour_level}/10 humorous. Tone: ${voiceProfile.tone_adjectives.join(", ")}. Opening: ${voiceProfile.opening_style}.`
    : "";

  const systemPrompt = `You are a newsletter content specialist at ContentForge.
You write newsletters that subscribers actually read and forward to friends.

NEWSLETTER STRUCTURE:
Issue #[N] — [Date or Topic Label]
Subject: [Compelling subject line]

Opening hook (2-3 sentences — personal, relevant)
The main insight (value-first, not promotional)
Supporting points (3 max, skimmable format)
The takeaway (actionable, memorable)
Single CTA (question OR link, never both)
Sign-off (warm, on-brand)

RULES:
- Value-first structure: teach before you pitch
- Issue numbering creates collection mentality
- "Forward-friendly" angle: give readers a reason to share
- Plain text reads better than HTML-heavy
- One idea per issue, not a dump of everything
- Skimmable: headers, bullets, white space
${voiceInstructions}

Return JSON: { "content": "full newsletter content" }`;

  const userMessage = `Create a newsletter issue:

TOPIC: ${brief.primary_topic}
CORE IDEAS: ${brief.core_ideas.join(" | ")}
KEY STATS: ${brief.key_stats.slice(0, 2).join(" | ") || "None"}
CTA: ${brief.call_to_action || "Share with someone who needs this"}
AUDIENCE: ${brief.target_audience}`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.PLATFORM,
    temperature: 0.75,
    maxTokens: 1200,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return { content: parsed.content || parsed.newsletter || response };
  } catch {
    return { content: response };
  }
}
