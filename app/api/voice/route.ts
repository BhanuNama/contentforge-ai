import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/db/getOrCreateUser";
import { createServiceClient } from "@/lib/supabase";
import { buildVoiceProfile } from "@/lib/agents/voice";
import { z } from "zod";

const VoiceSetupSchema = z.object({
  samples: z.array(z.string().min(50)).min(1).max(5),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = VoiceSetupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid samples" }, { status: 400 });
    }

    const profile = await buildVoiceProfile(parsed.data.samples);

    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
    }

    const db = createServiceClient();
    const { data: existing } = await db
      .from("voice_profiles")
      .select("id, version")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      await db
        .from("voice_profiles")
        .update({
          profile_json: profile,
          version: existing.version + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await db.from("voice_profiles").insert({
        user_id: user.id,
        profile_json: profile,
        version: 1,
      });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Voice setup error:", err);
    return NextResponse.json({ error: "Failed to build voice profile" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
    }

    const db = createServiceClient();
    const { data: profile } = await db
      .from("voice_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({ profile: profile?.profile_json || null });
  } catch (err) {
    console.error("Voice GET error:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
