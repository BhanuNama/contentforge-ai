import { callGroq, MODELS } from "../groq";
import { VoiceProfileOutputSchema, type VoiceProfileOutput } from "../schemas/agents";
import type { VoiceProfile } from "../supabase";

export async function buildVoiceProfile(samples: string[]): Promise<VoiceProfile> {
  const systemPrompt = `You are the ContentForge Brand Voice Agent.
Analyze writing samples and extract a precise voice profile.

Analyze:
- Sentence length patterns (short/punchy vs long/flowing)
- Vocabulary level (everyday/professional/technical/academic)
- Formality score (1=super casual, 10=very formal)
- Humour level (1=serious, 10=very humorous/playful)
- Tone adjectives (3-5 words describing the voice)
- Signature phrases (recurring expressions, starters, transitions)
- Words to avoid (overused or inconsistent with voice)
- Preferred CTA style (question/statement/link/soft-sell)
- Opening style (personal_story/stat/question/bold_claim)

Be precise and evidence-based. Only report what you genuinely detect in the samples.

Return ONLY valid JSON.`;

  const userMessage = `Analyze these writing samples and return a voice profile:

${samples.map((s, i) => `SAMPLE ${i + 1}:\n${s.slice(0, 800)}`).join("\n\n---\n\n")}

Return JSON with: formality_score (1-10), humour_level (1-10), avg_sentence_length (number), vocabulary_tier (everyday|professional|technical|academic), tone_adjectives (array of 3-5), signature_phrases (array), avoid_words (array), preferred_cta (question|statement|link|soft-sell), opening_style (personal_story|stat|question|bold_claim), samples_count (${samples.length}), corrections_applied (0)`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.VOICE,
    temperature: 0.4,
    maxTokens: 800,
    responseFormat: "json",
  });

  try {
    const parsed = JSON.parse(response);
    return VoiceProfileOutputSchema.parse({
      ...parsed,
      samples_count: samples.length,
      corrections_applied: 0,
    }) as VoiceProfile;
  } catch {
    return {
      formality_score: 5,
      humour_level: 5,
      avg_sentence_length: 15,
      vocabulary_tier: "everyday",
      tone_adjectives: ["conversational", "clear"],
      signature_phrases: [],
      avoid_words: ["leverage", "synergy"],
      preferred_cta: "question",
      opening_style: "bold_claim",
      samples_count: samples.length,
      corrections_applied: 0,
    };
  }
}

export async function updateVoiceProfileFromCorrection(
  currentProfile: VoiceProfile,
  original: string,
  edited: string
): Promise<VoiceProfile> {
  const systemPrompt = `You are the ContentForge Brand Voice Learning Agent.
A user just edited an AI-generated output. Learn from this correction to improve the voice profile.

Analyze the difference between original and edited, then return an updated voice profile.
Only update fields that genuinely changed based on the correction.
Return ONLY valid JSON of the updated voice profile.`;

  const userMessage = `Current voice profile:
${JSON.stringify(currentProfile, null, 2)}

ORIGINAL (AI generated):
${original.slice(0, 500)}

EDITED (user's version):
${edited.slice(0, 500)}

What does the edit reveal about the user's true voice? Return updated voice profile JSON.`;

  const response = await callGroq(systemPrompt, userMessage, {
    model: MODELS.VOICE,
    temperature: 0.4,
    maxTokens: 600,
    responseFormat: "json",
  });

  try {
    const updates = JSON.parse(response);
    return {
      ...currentProfile,
      ...updates,
      corrections_applied: (currentProfile.corrections_applied || 0) + 1,
    };
  } catch {
    return {
      ...currentProfile,
      corrections_applied: (currentProfile.corrections_applied || 0) + 1,
    };
  }
}
