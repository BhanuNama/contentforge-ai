import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/db/getOrCreateUser";
import { z } from "zod";
import { executeForgeJob } from "@/lib/agents/pipeline";

const ForgeRequestSchema = z.object({
  content: z.string().min(100, "Content must be at least 100 characters"),
  platforms: z.array(z.string()).min(1).max(8),
  sourceUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ForgeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Auto-creates user in Supabase if first visit (webhook not needed)
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
    }

    if (user.plan === "free" && user.repurposes_used >= user.repurposes_limit) {
      return NextResponse.json(
        { error: "Monthly limit reached. Upgrade to Pro for unlimited repurposes." },
        { status: 429 }
      );
    }

    const db = createServiceClient();

    const { data: job, error: jobError } = await db
      .from("forge_jobs")
      .insert({
        user_id: user.id,
        status: "pending",
        platforms: parsed.data.platforms,
        source_content: parsed.data.content,
        source_url: parsed.data.sourceUrl || null,
      })
      .select("id")
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }

    await db
      .from("users")
      .update({ repurposes_used: user.repurposes_used + 1 })
      .eq("id", user.id);

    executeForgeJob(job.id).catch(console.error);

    return NextResponse.json({ jobId: job.id, status: "pending" });
  } catch (err) {
    console.error("Forge API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
