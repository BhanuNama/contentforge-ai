import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getOrCreateUser } from "@/lib/db/getOrCreateUser";
import { updateVoiceProfileFromCorrection } from "@/lib/agents/voice";
import { z } from "zod";
import type { VoiceProfile } from "@/lib/supabase";

const CorrectionSchema = z.object({
  platform: z.string(),
  original: z.string(),
  edited: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CorrectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid correction data" }, { status: 400 });
    }

    if (parsed.data.original === parsed.data.edited) {
      return NextResponse.json({ updated: false, reason: "No changes detected" });
    }

    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
    }

    const db = createServiceClient();

    await db.from("voice_corrections").insert({
      user_id: user.id,
      platform: parsed.data.platform,
      original: parsed.data.original,
      edited: parsed.data.edited,
    });

    const { data: profileRow } = await db
      .from("voice_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!profileRow) {
      return NextResponse.json({ updated: false, reason: "No voice profile found" });
    }

    const currentProfile = profileRow.profile_json as VoiceProfile;
    const updatedProfile = await updateVoiceProfileFromCorrection(
      currentProfile,
      parsed.data.original,
      parsed.data.edited
    );

    await db
      .from("voice_profiles")
      .update({
        profile_json: updatedProfile,
        version: profileRow.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileRow.id);

    return NextResponse.json({ updated: true, profile: updatedProfile });
  } catch (err) {
    console.error("Voice update error:", err);
    return NextResponse.json({ error: "Failed to update voice profile" }, { status: 500 });
  }
}
