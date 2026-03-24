import { callGroq, MODELS } from "../groq";
import { ContentBriefSchema, type ContentBrief } from "../schemas/agents";

export async function runAnalystAgent(content: string): Promise<ContentBrief> {
  const systemPrompt = `You are the ContentForge Content Analyst Agent.
Your job is to deeply analyze source content and extract structured intelligence for platform specialists.

Extract:
- Up to 5 core ideas (the main arguments/points)
- Key statistics and data points
- The 3 best hook opportunities (surprising, curiosity-inducing, or controversial angles)
- Content type, detected tone, word count
- Primary topic and target audience
- Any clear call-to-action

Return ONLY valid JSON. Be precise and extract only what's genuinely in the content.`;

  const wordCount = content.split(/\s+/).length;
  const userMessage = `Analyze this content and return a structured brief:

CONTENT:
${content.slice(0, 3000)}${content.length > 3000 ? "\n[...content truncated for analysis...]" : ""}

Return JSON with: core_ideas (array), key_stats (array), best_hooks (array of 3 hooks), content_type, tone_detected, word_count (${wordCount}), primary_topic, target_audience, call_to_action`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.ANALYST,
    temperature: 0.4,
    maxTokens: 1024,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return ContentBriefSchema.parse({
      ...parsed,
      word_count: wordCount,
    });
  } catch {
    const lines = content.split("\n").filter(Boolean);
    return {
      core_ideas: lines.slice(0, 3).map((l) => l.slice(0, 100)),
      key_stats: [],
      best_hooks: [content.slice(0, 100)],
      content_type: "article",
      tone_detected: "neutral",
      word_count: wordCount,
      primary_topic: "General",
      target_audience: "General audience",
    };
  }
}
