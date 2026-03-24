import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import { formatRelativeTime, PLATFORM_CONFIG } from "@/lib/utils";
import { Library, Sparkles, ExternalLink } from "lucide-react";
import type { Platform } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Content Library" };

export default async function LibraryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const db = createServiceClient();
  const { data: user } = await db
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  const { data: library } = await db
    .from("content_library")
    .select("*, forge_jobs(platforms, status, source_content)")
    .eq("user_id", user?.id || "")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#0d1117] tracking-tight mb-1">Content Library</h1>
          <p className="text-[#6b7280] text-[15px]">
            {library?.length || 0} piece{library?.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <Link
          href="/forge"
          className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          New Forge
        </Link>
      </div>

      {!library || library.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-slate-100 p-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-5">
            <Library className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="font-extrabold text-[#0d1117] text-[18px] mb-2">Your library is empty</h3>
          <p className="text-[#6b7280] text-[15px] mb-6 max-w-xs mx-auto">
            Forge your first piece of content to see it appear here.
          </p>
          <Link href="/forge" className="inline-flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-7 py-3 rounded-full font-bold text-[14px] transition-colors">
            <Sparkles className="w-4 h-4" />
            Start Forging
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {library.map((item) => {
            const job = item.forge_jobs as {
              platforms: string[];
              status: string;
              source_content: string;
            } | null;
            const platforms = job?.platforms || [];
            const snippet = job?.source_content?.slice(0, 110) || item.title;

            return (
              <Link
                key={item.id}
                href={`/forge?jobId=${item.job_id}`}
                className="group bg-white p-6 rounded-[20px] border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-[14px] font-bold text-[#0d1117] line-clamp-2 flex-1 leading-snug">{item.title}</h3>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#3b82f6] transition-colors flex-shrink-0 mt-0.5" />
                </div>

                <p className="text-[13px] text-[#6b7280] line-clamp-3 mb-4 leading-relaxed">{snippet}...</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {platforms.slice(0, 4).map((platform) => {
                    const config = PLATFORM_CONFIG[platform as Platform];
                    return config ? (
                      <span
                        key={platform}
                        className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
                        style={{
                          color: config.color,
                          backgroundColor: config.color + "15",
                        }}
                      >
                        {config.name}
                      </span>
                    ) : null;
                  })}
                  {platforms.length > 4 && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
                      +{platforms.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {formatRelativeTime(item.created_at)}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    job?.status === "done" ? "bg-[#f0fdf4] text-[#10b981]" : "bg-slate-100 text-slate-500"
                  }`}>
                    {job?.status || "done"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
