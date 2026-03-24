import { z } from "zod";

export const OrchestratorOutputSchema = z.object({
  platforms: z.array(z.string()),
  priority: z.array(z.string()),
  requires_search: z.boolean().default(false),
  content_type: z.enum(["blog", "article", "essay", "guide", "story", "news", "other"]),
  warnings: z.array(z.string()).default([]),
  estimated_tokens: z.number().optional(),
});
export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;

export const ContentBriefSchema = z.object({
  core_ideas: z.array(z.string()).max(6),
  key_stats: z.array(z.string()).default([]),
  best_hooks: z.array(z.string()).max(5),
  content_type: z.string(),
  tone_detected: z.string(),
  word_count: z.number(),
  primary_topic: z.string(),
  target_audience: z.string(),
  call_to_action: z.string().optional(),
});
export type ContentBrief = z.infer<typeof ContentBriefSchema>;

export const PlatformOutputSchema = z.object({
  content: z.string(),
  hook_variants: z.array(z.string()).optional(),
  char_count: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type PlatformOutput = z.infer<typeof PlatformOutputSchema>;

export const CriticReportSchema = z.object({
  passed: z.boolean(),
  score: z.number().min(0).max(10),
  checks: z.object({
    char_limit: z.boolean(),
    hook_quality: z.number().min(0).max(10),
    platform_format: z.boolean(),
    no_hallucination: z.boolean(),
  }),
  feedback: z.string(),
  suggestions: z.array(z.string()).default([]),
});
export type CriticReport = z.infer<typeof CriticReportSchema>;

export const VoiceProfileOutputSchema = z.object({
  formality_score: z.number().min(1).max(10),
  humour_level: z.number().min(1).max(10),
  avg_sentence_length: z.number(),
  vocabulary_tier: z.enum(["everyday", "professional", "technical", "academic"]),
  tone_adjectives: z.array(z.string()),
  signature_phrases: z.array(z.string()),
  avoid_words: z.array(z.string()),
  preferred_cta: z.enum(["question", "statement", "link", "soft-sell"]),
  opening_style: z.enum(["personal_story", "stat", "question", "bold_claim"]),
  samples_count: z.number(),
  corrections_applied: z.number().default(0),
});
export type VoiceProfileOutput = z.infer<typeof VoiceProfileOutputSchema>;
