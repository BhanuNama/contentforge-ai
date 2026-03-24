import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          plan: "free" | "pro";
          repurposes_used: number;
          repurposes_limit: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      voice_profiles: {
        Row: {
          id: string;
          user_id: string;
          profile_json: VoiceProfile;
          version: number;
          updated_at: string;
          created_at: string;
        };
      };
      forge_jobs: {
        Row: {
          id: string;
          user_id: string;
          status: "pending" | "running" | "done" | "failed";
          platforms: string[];
          source_content: string;
          source_url: string | null;
          error: string | null;
          execution_plan: Record<string, unknown> | null;
          created_at: string;
          completed_at: string | null;
        };
      };
      forge_results: {
        Row: {
          id: string;
          job_id: string;
          platform: string;
          content: string;
          hook_variants: string[] | null;
          critic_score: number | null;
          critic_feedback: Record<string, unknown> | null;
          created_at: string;
        };
      };
      content_library: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          title: string;
          tags: string[];
          archived: boolean;
          created_at: string;
        };
      };
      voice_corrections: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          original: string;
          edited: string;
          applied_at: string | null;
          created_at: string;
        };
      };
      usage_events: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          tokens_used: number | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
      };
    };
  };
};

export type VoiceProfile = {
  formality_score: number;
  humour_level: number;
  avg_sentence_length: number;
  vocabulary_tier: "everyday" | "professional" | "technical" | "academic";
  tone_adjectives: string[];
  signature_phrases: string[];
  avoid_words: string[];
  preferred_cta: "question" | "statement" | "link" | "soft-sell";
  opening_style: "personal_story" | "stat" | "question" | "bold_claim";
  samples_count: number;
  corrections_applied: number;
  embedding?: number[];
};
