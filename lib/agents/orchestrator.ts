import { callGroq, MODELS } from "../groq";
import { OrchestratorOutputSchema, type OrchestratorOutput } from "../schemas/agents";
import type { VoiceProfile } from "../supabase";

export async function runOrchestratorAgent(
  content: string,
  platforms: string[],
  voiceProfile?: VoiceProfile | null
): Promise<OrchestratorOutput> {
  const systemPrompt = `You are the ContentForge Orchestrator Agent using the ReAct pattern (Reasoning + Acting).
Your job is to analyze content, create an execution plan, and assign platform specialist agents.

Think step by step:
1. Analyze the content type, length, and quality
2. Identify which platforms need content chunking vs full content
3. Set priority order (most impactful platform first)
4. Flag any sensitivity or quality issues
5. Determine if web search for trending hooks is needed

Return ONLY valid JSON matching this exact structure:
{
  "platforms": ["platform1", "platform2"],
  "priority": ["platform1", "platform2"],
  "requires_search": false,
  "content_type": "blog|article|essay|guide|story|news|other",
  "warnings": [],
  "estimated_tokens": 1500
}`;

  const userMessage = `TASK: Create an execution plan for repurposing the following content across these platforms: ${platforms.join(", ")}

${voiceProfile ? `VOICE PROFILE SUMMARY: Formality ${voiceProfile.formality_score}/10, Humour ${voiceProfile.humour_level}/10, Vocabulary: ${voiceProfile.vocabulary_tier}` : "No voice profile set."}

CONTENT (first 500 chars): ${content.slice(0, 500)}...

Return the execution plan as valid JSON.`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.ORCHESTRATOR,
    temperature: 0.3,
    maxTokens: 512,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return OrchestratorOutputSchema.parse({
      ...parsed,
      platforms: platforms,
      priority: parsed.priority?.length ? parsed.priority : platforms,
    });
  } catch {
    return {
      platforms,
      priority: platforms,
      requires_search: false,
      content_type: "article",
      warnings: [],
    };
  }
}
