import { callGroq, MODELS } from "../../groq";
import type { ContentBrief } from "../../schemas/agents";
import type { VoiceProfile } from "../../supabase";

export async function runEmailAgent(
  brief: ContentBrief,
  voiceProfile?: VoiceProfile | null
): Promise<{ content: string; hook_variants: string[] }> {
  const voiceInstructions = voiceProfile
    ? `VOICE: ${voiceProfile.formality_score}/10 formal. Opening style: ${voiceProfile.opening_style}. CTA style: ${voiceProfile.preferred_cta}.`
    : "";

  const systemPrompt = `You are an email marketing specialist at ContentForge.
You write emails that get opened, read, and clicked.

FORMAT:
SUBJECT LINE A: [Version A — curiosity-driven]
SUBJECT LINE B: [Version B — benefit-driven]
SUBJECT LINE C: [Version C — urgency/social proof]
PREVIEW TEXT: [45-90 char preview that complements subject]

---EMAIL BODY---
[Personal hook — 1-2 sentences, creates connection]
[Body — clear value delivery, scannable format]
[CTA — single, clear action]
[Signature]

RULES:
- Subject lines: 40-60 chars for mobile display
- Preview text: not a repeat of subject
- Above-the-fold hook in first 2 sentences
- One CTA only (never two competing actions)
- Short paragraphs (3-4 lines max)
- Plain text friendly
${voiceInstructions}

Return JSON: { "content": "full email with all subject variants and body", "hook_variants": ["subject A", "subject B", "subject C"] }`;

  const userMessage = `Create an email newsletter from this content:

TOPIC: ${brief.primary_topic}
CORE IDEAS: ${brief.core_ideas.join(" | ")}
KEY STATS: ${brief.key_stats.slice(0, 3).join(" | ") || "None"}
HOOKS: ${brief.best_hooks.join(" | ")}
CTA: ${brief.call_to_action || "Learn more"}
AUDIENCE: ${brief.target_audience}`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.PLATFORM,
    temperature: 0.7,
    maxTokens: 1500,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return {
      content: parsed.content || parsed.email || "",
      hook_variants: parsed.hook_variants || [],
    };
  } catch {
    return { content: response, hook_variants: [] };
  }
}
