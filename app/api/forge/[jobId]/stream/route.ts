import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = createServiceClient();

  const { data: user } = await db
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      let attempts = 0;
      const maxAttempts = 120; // 2 minutes max polling

      const poll = async () => {
        if (attempts >= maxAttempts) {
          send({ type: "timeout", message: "Job timed out" });
          controller.close();
          return;
        }

        attempts++;

        const { data: job } = await db
          .from("forge_jobs")
          .select("status, error")
          .eq("id", jobId)
          .eq("user_id", user.id)
          .single();

        if (!job) {
          send({ type: "error", message: "Job not found" });
          controller.close();
          return;
        }

        send({ type: "status", status: job.status, attempts });

        if (job.status === "done") {
          const { data: results } = await db
            .from("forge_results")
            .select("*")
            .eq("job_id", jobId)
            .order("created_at", { ascending: true });

          send({
            type: "complete",
            results: results || [],
          });
          controller.close();
          return;
        }

        if (job.status === "failed") {
          send({ type: "error", message: job.error || "Pipeline failed" });
          controller.close();
          return;
        }

        // Poll every 2 seconds
        setTimeout(poll, 2000);
      };

      // Initial delay then start polling
      setTimeout(poll, 1000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
