import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    const db = createServiceClient();

    if (type === "user.created") {
      const { id, email_addresses, primary_email_address_id } = data;
      const primaryEmail = email_addresses?.find(
        (e: { id: string; email_address: string }) => e.id === primary_email_address_id
      );

      await db.from("users").insert({
        clerk_id: id,
        email: primaryEmail?.email_address || "",
        plan: "free",
        repurposes_used: 0,
        repurposes_limit: 5,
      });
    }

    if (type === "user.deleted") {
      await db.from("users").delete().eq("clerk_id", data.id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
