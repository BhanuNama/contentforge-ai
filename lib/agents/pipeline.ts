import { createServiceClient, type VoiceProfile } from "../supabase";
import { runOrchestratorAgent } from "./orchestrator";
import { runAnalystAgent } from "./analyst";
import { runTwitterAgent } from "./platforms/twitter";
import { runLinkedInAgent } from "./platforms/linkedin";
import { runYouTubeAgent } from "./platforms/youtube";
import { runEmailAgent } from "./platforms/email";
import { runInstagramAgent } from "./platforms/instagram";
import { runTikTokAgent } from "./platforms/tiktok";
import { runNewsletterAgent } from "./platforms/newsletter";
import { runBlogAgent } from "./platforms/blog";
import { runCriticAgent } from "./critic";
import type { ContentBrief } from "../schemas/agents";

type PlatformResult = {
  platform: string;
  content: string;
  hook_variants?: string[];
  critic_score: number;
  critic_feedback: Record<string, unknown>;
};

async function runPlatformAgent(
  platform: string,
  brief: ContentBrief,
  voiceProfile?: VoiceProfile | null
): Promise<{ content: string; hook_variants?: string[] }> {
  switch (platform) {
    case "twitter": return runTwitterAgent(brief, voiceProfile);
    case "linkedin": return runLinkedInAgent(brief, voiceProfile);
    case "youtube": return runYouTubeAgent(brief, voiceProfile);
    case "email": return runEmailAgent(brief, voiceProfile);
    case "instagram": return runInstagramAgent(brief, voiceProfile);
    case "tiktok": return runTikTokAgent(brief, voiceProfile);
    case "newsletter": return runNewsletterAgent(brief, voiceProfile);
    case "blog": return runBlogAgent(brief, voiceProfile);
    default: return { content: "Platform not supported yet." };
  }
}

export async function executeForgeJob(jobId: string): Promise<void> {
  const db = createServiceClient();

  try {
    const { data: job, error: jobError } = await db
      .from("forge_jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !job) throw new Error("Job not found");

    await db.from("forge_jobs").update({ status: "running" }).eq("id", jobId);

    const voiceProfileRow = await db
      .from("voice_profiles")
      .select("profile_json")
      .eq("user_id", job.user_id)
      .single();
    const voiceProfile = voiceProfileRow.data?.profile_json as VoiceProfile | null;

    // Step 1: Orchestrator
    const plan = await runOrchestratorAgent(job.source_content, job.platforms, voiceProfile);
    await db.from("forge_jobs").update({ execution_plan: plan as Record<string, unknown> }).eq("id", jobId);

    // Step 2: Analyst
    const brief = await runAnalystAgent(job.source_content);

    // Step 3: Platform agents in parallel
    const platformResults = await Promise.allSettled(
      plan.platforms.map(async (platform): Promise<PlatformResult> => {
        const output = await runPlatformAgent(platform, brief, voiceProfile);

        // Step 4: Critic
        const criticReport = await runCriticAgent(
          platform,
          output.content,
          job.source_content
        );

        // Auto-retry once if critic fails
        let finalContent = output.content;
        let finalCritic = criticReport;

        if (!criticReport.passed && criticReport.score < 6) {
          const retry = await runPlatformAgent(platform, brief, voiceProfile);
          const retrycritic = await runCriticAgent(platform, retry.content, job.source_content);
          if (retrycritic.score > criticReport.score) {
            finalContent = retry.content;
            finalCritic = retrycritic;
          }
        }

        return {
          platform,
          content: finalContent,
          hook_variants: output.hook_variants,
          critic_score: finalCritic.score,
          critic_feedback: {
            passed: finalCritic.passed,
            checks: finalCritic.checks,
            feedback: finalCritic.feedback,
            suggestions: finalCritic.suggestions,
          },
        };
      })
    );

    // Step 5: Write results
    const successfulResults: PlatformResult[] = [];
    for (const result of platformResults) {
      if (result.status === "fulfilled") {
        successfulResults.push(result.value);
      }
    }

    if (successfulResults.length > 0) {
      await db.from("forge_results").insert(
        successfulResults.map((r) => ({
          job_id: jobId,
          platform: r.platform,
          content: r.content,
          hook_variants: r.hook_variants || null,
          critic_score: r.critic_score,
          critic_feedback: r.critic_feedback,
        }))
      );

      // Save to content library
      const titleWords = job.source_content.split(/\s+/).slice(0, 8).join(" ");
      await db.from("content_library").insert({
        user_id: job.user_id,
        job_id: jobId,
        title: titleWords + "...",
        tags: [plan.content_type],
        archived: false,
      });

      // Track usage
      await db.from("usage_events").insert({
        user_id: job.user_id,
        event_type: "forge_complete",
        tokens_used: plan.estimated_tokens || 8000,
        metadata: { platforms: plan.platforms, job_id: jobId },
      });

      // Usage already incremented in the API route
    }

    await db.from("forge_jobs").update({
      status: "done",
      completed_at: new Date().toISOString(),
    }).eq("id", jobId);

  } catch (err) {
    await db.from("forge_jobs").update({
      status: "failed",
      error: err instanceof Error ? err.message : "Unknown error",
    }).eq("id", jobId);
    throw err;
  }
}
