import { currentUser } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";

/**
 * Gets the Supabase user row for the current Clerk session,
 * creating it automatically if it doesn't exist yet.
 * This removes the dependency on the Clerk webhook being configured.
 */
export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const db = createServiceClient();

  // Try to fetch existing user
  const { data: existing } = await db
    .from("users")
    .select("*")
    .eq("clerk_id", clerkUser.id)
    .single();

  if (existing) return existing;

  // Auto-create if not found (webhook may not be configured yet)
  const primaryEmail =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? "";

  const { data: created, error } = await db
    .from("users")
    .insert({
      clerk_id: clerkUser.id,
      email: primaryEmail,
      plan: "free",
      repurposes_used: 0,
      repurposes_limit: 5,
    })
    .select("*")
    .single();

  if (error) {
    // Race condition — another request may have just created it
    const { data: retry } = await db
      .from("users")
      .select("*")
      .eq("clerk_id", clerkUser.id)
      .single();
    return retry;
  }

  return created;
}
