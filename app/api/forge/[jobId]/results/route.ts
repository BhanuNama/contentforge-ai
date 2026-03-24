import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = createServiceClient();

    const { data: user } = await db
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: job } = await db
      .from("forge_jobs")
      .select("id, status, platforms, error, created_at, completed_at")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const { data: results } = await db
      .from("forge_results")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      job,
      results: results || [],
    });
  } catch (err) {
    console.error("Results API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
