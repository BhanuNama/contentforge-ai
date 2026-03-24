import { callGroq, MODELS } from "../../groq";
import type { ContentBrief } from "../../schemas/agents";
import type { VoiceProfile } from "../../supabase";

export async function runBlogAgent(
  brief: ContentBrief,
  voiceProfile?: VoiceProfile | null
): Promise<{ content: string }> {
  const voiceInstructions = voiceProfile
    ? `VOICE: ${voiceProfile.vocabulary_tier} vocabulary, ${voiceProfile.formality_score}/10 formal.`
    : "";

  const systemPrompt = `You are an SEO and blog content specialist at ContentForge.
You create blog summaries, meta content, and SEO elements that rank.

FORMAT:
SEO TITLE: [60 chars max — primary keyword first]
META DESCRIPTION: [150-160 chars — compelling, keyword-rich]
EXCERPT: [2-3 sentences — used for social sharing and RSS]
KEY TAKEAWAYS:
• [Point 1]
• [Point 2]
• [Point 3]
INTERNAL LINKING SUGGESTIONS:
• [Topic cluster idea 1]
• [Topic cluster idea 2]
SCHEMA MARKUP HINTS:
• Article type: [BlogPosting/HowTo/FAQ/etc]
• Primary keyword: [keyword]
• Reading time: [X mins]
TAGS: [5-8 relevant tags]

RULES:
- Primary keyword in title, meta, and first paragraph
- Meta description: curiosity gap + clear benefit
- Takeaways should be distinct and memorable
- Schema hints improve rich snippet chances
${voiceInstructions}

Return JSON: { "content": "full formatted SEO brief" }`;

  const userMessage = `Create SEO content for this blog post:

TOPIC: ${brief.primary_topic}
CORE IDEAS: ${brief.core_ideas.join(" | ")}
KEY STATS: ${brief.key_stats.slice(0, 3).join(" | ") || "None"}
CONTENT TYPE: ${brief.content_type}
WORD COUNT: ${brief.word_count}
AUDIENCE: ${brief.target_audience}`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.PLATFORM,
    temperature: 0.6,
    maxTokens: 900,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return { content: parsed.content || parsed.seo || response };
  } catch {
    return { content: response };
  }
}
