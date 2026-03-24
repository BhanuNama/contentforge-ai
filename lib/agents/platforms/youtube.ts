import { callGroq, MODELS } from "../../groq";
import type { ContentBrief } from "../../schemas/agents";
import type { VoiceProfile } from "../../supabase";

export async function runYouTubeAgent(
  brief: ContentBrief,
  voiceProfile?: VoiceProfile | null
): Promise<{ content: string }> {
  const voiceInstructions = voiceProfile
    ? `Voice: ${voiceProfile.formality_score}/10 formal, ${voiceProfile.vocabulary_tier} vocabulary.`
    : "";

  const systemPrompt = `You are a YouTube SEO and content specialist at ContentForge.
You write titles, descriptions, and timestamps that rank and get clicks.

FORMAT:
TITLE OPTIONS:
[3 SEO-optimized title variants — curiosity, how-to, list formats]

DESCRIPTION:
[Hook paragraph — 2-3 sentences, keyword-rich]
[What viewers will learn — bullet points]
[Timestamps section]
[Subscribe CTA]
[Hashtags — 3-5 relevant tags]

TIMESTAMPS:
[00:00 - Intro]
[01:30 - Section 1]
[etc.]

RULES:
- Title: 60 chars max for full display
- Description: keyword density matters — use primary keyword 3x naturally
- Timestamps improve retention and SEO
- Subscribe CTA in first 300 chars of description
${voiceInstructions}

Return JSON: { "content": "full formatted description with titles and timestamps" }`;

  const userMessage = `Create YouTube title options, description, and timestamps:

TOPIC: ${brief.primary_topic}
CORE IDEAS: ${brief.core_ideas.join(" | ")}
KEY STATS: ${brief.key_stats.slice(0, 3).join(" | ") || "None"}
CONTENT TYPE: ${brief.content_type}
AUDIENCE: ${brief.target_audience}`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.PLATFORM,
    temperature: 0.7,
    maxTokens: 1200,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return { content: parsed.content || parsed.description || response };
  } catch {
    return { content: response };
  }
}
